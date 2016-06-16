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
          "./UsergridClient" ],
function( declare,
          lang,
          Deferred,
          util,
          cookie,
          UsergridClient )
{
    return declare( [], {
        VALID_DATA_TYPES : [ "object", "connection" ],
        postscript : function()
        {
            this.inherited( arguments );
            this._ugc = new UsergridClient();
        },
        handleRequest : function( req )
        {
            return this.parseRequest( req, this.VALID_DATA_TYPES ).then( lang.hitch( this, function( message )
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
        parseRequest : function( req )
        {
            return util.parseRequest( req, this.VALID_DATA_TYPES ).then( lang.hitch( this, function( message )
            {
                if( typeof message.request_map.collection_name != "string" )
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
            } ) );
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
                body : util.getResponseMessage( req, util.sanitize( message ), [ {
                    code_key : "200", user_message : "ok"
                } ] )
            } );
        },
        _handleUsergridError : function( req, error )
        {
            var errMessage = util.sanitize( JSON.parse( error.response.text ) );
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
            var message = util.getResponseMessage( req, {}, logList, true );
            return new Deferred().resolve( { body :  message } );
        },
        _handleProtocolError : function( req, errors )
        {
            return new Deferred().resolve({ body : util.getResponseMessage( req || {}, {}, errors, true ) } );
        }
    } );
} );