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
        LOG_LEVELS : [ "debug", "info", "warn", "error", "fatal", "off" ],
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
            handleAs = handleAs || "json";
            if( req.method == "GET" )
            {
                return new Deferred().resolve( "" );
            }
            else if( handleAs == "json" && req._jsonMessage )
            {
                return new Deferred().resolve( req._jsonMessage )
            }
            else if( handleAs != "json" && req._body )
            {
                return new Deferred().resolve( req._body )
            }
            else
            {
                var prom = new Deferred();
                var body = [];
                req.on( "data", lang.hitch( this, function( chunk )
                {
                    body.push( chunk );
                } ) ).on( "end", lang.hitch( this, function()
                {
                    body = Buffer.concat( body ).toString();
                    req._body = body;
                    if( handleAs == "json" )
                    {
                        try
                        {
                            req._jsonMessage = JSON.parse( body );
                            prom.resolve( req._jsonMessage );
                        }
                        catch( e )
                        {
                            console.error( "Failed to parse response body:", body );
                            prom.reject( "Failed to parse response body." );
                        }
                    }
                    else
                    {
                        prom.resolve( req._body );
                    }
                } ) );
                return prom;
            }
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
                    return this.rejectRequest( "invalid_action_str" );
                }
                else if( !message.request_map )
                {
                    return this.rejectRequest( "missing_request_map" );
                }
                else if( validDataTypes.indexOf( message.data_type ) == -1 )
                {
                    return this.rejectRequest( "invalid_data_type" );
                }
                return new Deferred().resolve( message );
            }));
        },
        rejectRequest : function( userMessage )
        {
            return new Deferred().reject([{
                code_key : "400",
                user_message : userMessage || "invalid_request"
            }]);
        },
        getResponseMessage : function( req, respData, logList, isError )
        {
            var reqMessage = req._jsonMessage || {};
            var actionStr = reqMessage.action_str || "retrieve";
            return {
                action_str : isError ? actionStr + "_fail" : this.ACTION_MAP[ actionStr ],
                data_type : reqMessage.data_type,
                log_list : logList || [],
                response_map : respData || {}
            }
        },
        getErrorMessage : function( req, codeKey, codeStr, userMsg, errLevel )
        {
            return this.getResponseMessage( req, false, [
                this.getLogItem( {
                    code_key : codeKey,
                    code_str : codeStr,
                    user_msg : userMsg,
                    level_int : errLevel || 3
                } ) ], true );
        },
        getLogItem : function( kwObj )
        {
            return {
                code_key : ( kwObj.code_key || "500" ) + "",
                code_str : kwObj.code_str || "internal_error",
                user_msg : kwObj.user_msg || "internal_error",
                level_int : kwObj.level_int || 0,
                level_str : this.LOG_LEVELS[ kwObj.level_int || 0 ]
            };
        }
    }
});