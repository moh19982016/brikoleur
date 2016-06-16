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
        RESPONSE_PARAMS_TO_SANITIZE : [ "exception", "application", "organization" ],
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
        VALID_ACTION_STRINGS : [ "create", "retrieve", "update", "delete", "flush" ],
        ACTION_MAP : {
            "create" : "created",
            "retrieve" : "retrieved",
            "update" : "updated",
            "delete" : "deleted",
            "flush" : "flushed"
        },
        fileNameRegExp : /\.\./,
        /**
         * Writes message into response and ends stream. Default contentType is application/json and default status
         * is 200.
         *
         * @param resp
         * @param message - {
         *                      body? : {string|Object|fileStream},
         *                      isStream? : boolean,
         *                      headers? : {Object},
         *                      contentType? : {string},
         *                      status? : int
         *                  }
         */
        writeResponse : function( resp, message )
        {
            message = message || {};
            var contentType = message.contentType || "application/json";
            var statusCode = message.status || 200;
            var headers = message.headers || {};
            var body = message.body || {};
            if( message.isStream )
            {
                resp.writeHead( statusCode, lang.mixin( {
                    'Content-Type': contentType }, headers ) );
                if( body.pipe )
                {
                    body.pipe( resp );
                }
                else
                {
                    this.writeResponse( resp, { status : 500, body : { error : "internal_error" } } );
                }
            }
            else
            {
                if( contentType == "application/json" && typeof body != "string" )
                {
                    body = JSON.stringify( body, false, 2 );
                }
                resp.writeHead( statusCode, lang.mixin( {
                    'Content-Length': body.length,
                    'Content-Type': contentType }, headers ) );
                resp.write( body );
                resp.end();
            }
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
            return new Deferred().resolve( { body : message, status : status });
        },
        sanitize : function( message )
        {
            if( typeof message == "string" )
            {
                try
                {
                    message = JSON.parse( message );
                }
                catch( e )
                {
                    return {};
                }
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
        getStream : function( fileName )
        {
            var prom = new Deferred();
            if( this.fileNameRegExp.test( fileName ) )
            {
                return prom.reject();
            }
            else
            {
                fs.stat( fileName, lang.hitch( this, function( err, stat )
                {
                    if( err )
                    {
                        prom.reject();
                    }
                    else
                    {
                        prom.resolve( {
                            isStream : true,
                            contentType : this.contentTypes[ path.extname( fileName ).split( "." )[ 1 ] ] || "application/octet-stream",
                            body : fs.createReadStream( fileName )
                        } );
                    }
                } ) );
            }
            return prom;
        },
        parseRequest : function( req, validDataTypes )
        {
            return this.readBody( req, false ).then( lang.hitch( this, function( message )
            {
                req._reqMessage = message;
                if( this.VALID_ACTION_STRINGS.indexOf( message.action_str ) == -1 )
                {
                    return new Deferred().reject([{
                        code_key : "400",
                        user_message : "Invalid action_str: " + message.action_str
                    }]);
                }
                else if( !message.request_map )
                {
                    return new Deferred().reject([{
                        code_key : "400",
                        user_message : "Missing request_map."
                    }]);
                }
                else if( validDataTypes.indexOf( message.data_type ) == -1 )
                {
                    return new Deferred().reject([{
                        code_key : "400",
                        user_message : "Invalid data_type: " + message.data_type
                    }]);
                }
                else if( typeof message.request_map.collection_name != "string" )
                {
                    return new Deferred().reject([{
                        code_key : "400",
                        user_message : "Missing request_map.collection_name."
                    }]);
                }
                else if( message.action_str == "create" && !( message.request_map.object_data instanceof Object ) )
                {
                    return new Deferred().reject([{
                        code_key : "400",
                        user_message : "Missing object_data."
                    }]);
                }
                else if( message.action_str == "update"
                         && ( typeof message.request_map.object_id != "string"
                              || !( message.request_map.object_data instanceof Object ) ) )
                {
                    return new Deferred().reject([{
                        code_key : "400",
                        user_message : "Missing object_id or missing object_data."
                    }]);
                }
                else if( message.action_str == "delete"
                         && typeof message.request_map.object_id != "string" )
                {
                    return new Deferred().reject([{
                        code_key : "400",
                        user_message : "Missing object_id."
                    }]);
                }
                return new Deferred().resolve( message );
            }));
        },
        getResponseMessage : function( req, respData, logList, isError )
        {
            var reqMessage = req._jsonMessage || {};
            var actionStr = reqMessage.action_str || "retrieve";
            return {
                action_str : isError ? actionStr + "_fail" : this.ACTION_MAP[ actionStr ],
                data_type : reqMessage.data_type,
                log_list : logList || [],
                response_map : respData
            }
        }
    }
});