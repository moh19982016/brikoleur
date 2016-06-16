define( [ "dojo/_base/lang",
          "dojo/string",
          "dojo/Deferred",
          "dojo/node!fs",
          "dojo/node!path",
          "dojo/node!nodemailer",
          "dojo/text!./templates/ErrorTemplate.html" ],
function( lang,
          string,
          Deferred,
          fs,
          path,
          nodemailer,
          errorTemplate )
{
    return {
        RESPONSE_PARAMS_TO_SANITIZE : [ "exception" ],
        contentTypes : {
            "js" : "application/javascript",
            "html" : "text/html",
            "css" : "text/css",
            "txt" : "text/plain",
            "svg" : "image/svg+xml",
            "woff" : "application/font-woff",
            "eot" : "application/vnd.ms-fontobject",
            "ttf" : "application/x-font-ttf",
            "otf" : "application/x-font-opentype"
        },
        fileNameRegExp : /\.\./,
        writeResponse : function( resp, body, contentType, statusCode, headers )
        {
            contentType = contentType || "application/json";
            statusCode = statusCode || 200;
            if( contentType == "application/json" && typeof body != "string" )
            {
                body = JSON.stringify( body, false, 2 );
            }
            headers = headers || {};
            resp.writeHead( statusCode, lang.mixin( {
                'Content-Length': body.length,
                'Content-Type': contentType }, headers ) );
            resp.write( body );
            resp.end();
        },
        readBody : function( req, handleAs )
        {
            if( req.method == "GET" )
            {
                return new Deferred().resolve( "" );
            }
            else if( req._body )
            {
                return new Deferred().resolve( handleAs == "text" ? req._body : JSON.parse( req._body ) )
            }
            var prom = new Deferred();
            var body = [];
            req.on( "data", lang.hitch( this, function( chunk )
            {
                body.push( chunk );
            } ) ).on( "end", lang.hitch( this, function()
            {
                body = Buffer.concat( body ).toString();
                try
                {
                    req._body = body;
                    prom.resolve( handleAs == "text" ? body : JSON.parse( body ) );
                }
                catch( e )
                {
                    console.error( "Failed to parse response body:", body );
                    prom.reject( "Failed to parse response body." );
                }
            } ) );
            return prom;
        },
        forwardJsonError : function( resp, err )
        {
            var message = {
                error : "bad_request"
            };
            var status = 400;
            try
            {
                message = this.sanitizeResponse( err.response.text );
                status = err.response.status;
            }
            catch( e )
            {
                console.error( "Unexpected error processing response:", err );
            }
            this.writeResponse( resp, message, false, status );
        },
        writeErrorResponse : function( resp, message, status )
        {
            this.forwardJsonError( resp, message );
        },
        sanitizeResponse : function( message )
        {
            if( typeof message == "string" )
            {
                message = JSON.parse( message );
            }
            for( var i = 0; i < this.RESPONSE_PARAMS_TO_SANITIZE.length; i++ )
            {
                delete message[ this.RESPONSE_PARAMS_TO_SANITIZE[ i ] ];
            }
            return message;
        },
        /**
         * Send mail with nodemailer.
         *
         * @param message - {
         *      to : "Petteri.Sulonen@iki.fi",
         *      subject : "Hello!",
         *      text : "Hello, sailors.",
         *      html : "Hello, <b>sailors.</b>"
         *  };
         * @returns {Deferred}
         */
        sendMail : function( message )
        {
            var prom = new Deferred();
            message.from = message.from || serverConfig.mail.from;
            var transport = nodemailer.createTransport( serverConfig.mail.transport );
            transport.sendMail( message, function( error, info )
            {
                if( error )
                {
                    prom.reject( error );
                }
                else
                {
                    prom.resolve( info );
                }
            });
            return prom;
        },
        serveStaticResource : function( fileName, resp )
        {
            if( this.fileNameRegExp.test( fileName ) )
            {
                this.writeErrorResponse( resp, "500 Internal Error", 500 );
            }
            else
            {
                fs.stat( fileName, lang.hitch( this, function( err, stat )
                {
                    if( err )
                    {
                        this.writeErrorResponse( resp, "404 Not Found", 404 );
                    }
                    else
                    {
                        var mimeType = this.contentTypes[ path.extname( fileName ).split( "." )[ 1 ] ] || "application/octet-stream";
                        resp.writeHead( 200, { "Content-Type" : mimeType } );
                        var fileStream = fs.createReadStream( fileName );
                        fileStream.pipe( resp );
                    }
                } ) );
            }
        }
    }
});