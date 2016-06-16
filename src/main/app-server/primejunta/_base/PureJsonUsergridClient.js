/**
 * JSON-pure client for Usergrid. Wraps Usergrid responses as JSON-pure messages. Handles authorisation errors in a way
 * that our JSON-pure client understands what's going on and can take appropriate action.
 *
 * @public Class
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/Deferred",
          "./util",
          "dojo/node!cookie",
          "./ApplicationClient" ],
function( declare,
          lang,
          Deferred,
          util,
          cookie,
          ApplicationClient )
{
    return declare( [], {
        VALID_ACTION_STRINGS : [ "create", "retrieve", "update", "delete", "flush" ],
        ACTION_MAP : {
            "create" : "created",
            "retrieve" : "retrieved",
            "update" : "updated",
            "delete" : "deleted",
            "flush" : "flushed"
        },
        VALID_DATA_TYPES : [ "object", "connection" ],
        PROPERTIES_TO_SANITIZE : [ "exception", "application", "organization" ],
        postscript : function()
        {
            this.inherited( arguments );
            this._ugc = new ApplicationClient();
        },
        handleRequest : function( req )
        {
            return this._parseRequest( req ).then( lang.hitch( this, function( message )
            {
                this._ugc.set( "access_token", cookie.parse( req.headers.cookie || "" ).access_token || false );
                switch( message.action_str.toLowerCase() )
                {
                    case "create" :
                        return this._create( req, message );
                    case "retrieve" :
                        return this._retrieve( req, message );
                    case "update" :
                        return this._update( req, message );
                    case "delete" :
                        return this._delete( req, message );
                }
            }),
            lang.hitch( this, this._handleProtocolError, req ) );
        },
        _parseRequest : function( req )
        {
            return util.readBody( req, false ).then( lang.hitch( this, function( message )
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
                else if( this.VALID_DATA_TYPES.indexOf( message.data_type ) == -1 )
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
        _create : function( req, message )
        {
            switch( message.data_type )
            {
                case "object" :
                    return this._ugc.createObject( message.request_map.collection_name,
                                                   message.request_map.object_data,
                                                   message.request_map.connection_name ).then(
                        lang.hitch( this, this._handleUsergridResponse, req  ),
                        lang.hitch( this, this._handleUsergridError, req  ) );
                case "connection" :
                    return this._handleProtocolError( req, [ { code_key : "404", user_message : "not_found" } ] ); // not implemented yet
                default :
                    return this._handleProtocolError( req, [ { code_key : "400", user_message : "bad_request" } ] );
            }
        },
        _retrieve : function( req, message )
        {
            switch( message.data_type )
            {
                case "object" :
                    return this._ugc.retrieveObjects( message.request_map.collection_name,
                                                      message.request_map.object_id,
                                                      message.request_map.connection_name ).then(
                        lang.hitch( this, this._handleUsergridResponse, req  ),
                        lang.hitch( this, this._handleUsergridError, req  ) );
                case "connection" :
                    return this._handleProtocolError( req, [ { code_key : "404", user_message : "not_found" } ] ); // not implemented yet
                default :
                    return this._handleProtocolError( req, [ { code_key : "400", user_message : "bad_request" } ] );
            }
        },
        _update : function( req, message )
        {
            return this._ugc.updateObject( message.request_map.collection_name,
                                           message.request_map.object_id,
                                           message.request_map.object_data,
                                           message.request_map.connection_name ).then(
                lang.hitch( this, this._handleUsergridResponse, req  ),
                lang.hitch( this, this._handleUsergridError, req  ) );
        },
        _delete : function( req, message )
        {
            switch( message.data_type )
            {
                case "object" :
                    return this._ugc.deleteObject( message.request_map.collection_name,
                                                   message.request_map.object_id,
                                                   message.request_map.connection_name ).then(
                        lang.hitch( this, this._handleUsergridResponse, req  ),
                        lang.hitch( this, this._handleUsergridError, req  ) );
                case "connection" :
                    return this._handleProtocolError( req, [ { code_key : "404", user_message : "not_found" } ] ); // not implemented yet
                default :
                    return this._handleProtocolError( req, [ { code_key : "400", user_message : "bad_request" } ] );
            }
        },
        _handleUsergridResponse : function( req, message )
        {
            return new Deferred().resolve( {
                body : this._getResponseObject( req._reqMessage, this._sanitize( message ), [ {
                    code_key : "200", user_message : "ok"
                } ] )
            } );
        },
        _handleUsergridError : function( req, error )
        {
            var errMessage = this._sanitize( JSON.parse( error.response.text ) );
            var userMessage = error.response.statusMessage;
            if( error.response.status == 401 )
            {
                userMessage = "access_key_required";
            }
            var logList = [];
            logList.push( lang.mixin( errMessage, {
                code_key : "" + error.response.status,
                user_message : userMessage
            } ));
            var message = this._getResponseObject( req._reqMessage, {}, logList, true );
            return new Deferred().resolve( { body :  message } );
        },
        _handleProtocolError : function( req, errors )
        {
            return new Deferred().resolve({ body : this._getResponseObject( req._reqMessage || {}, {}, errors, true ) } );
        },
        _sanitize : function( message )
        {
            for( var o in message )
            {
                if( this.PROPERTIES_TO_SANITIZE.indexOf( o ) != -1 )
                {
                    delete message[ o ];
                }
            }
            return message;
        },
        _getResponseObject : function( reqMessage, respData, logList, isError )
        {
            return {
                action_str : isError ? ( reqMessage.action_str || "retrieve" ) + "_fail" : this.ACTION_MAP[ reqMessage.action_str ],
                data_type : reqMessage.data_type,
                log_list : logList || [],
                response_map : respData
            }
        }
    } );
} );