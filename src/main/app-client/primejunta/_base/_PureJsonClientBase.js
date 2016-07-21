/**
 * Base class for a JSON-pure client. Things of note:
 * * I do not expose the access_key in the transaction_map property: instead, it's passed as a secure cookie.
 *
 * @public Base
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/cookie",
          "dojo/Deferred",
          "app/primejunta/_base/json-request" ],
function( declare,
          lang,
          cookie,
          Deferred,
          jsonRequest )
{
    return declare( [], {
        authorizationEndpoint : "",
        tokenEndpoint : "",
        returnUrl : "",
        apiUrl : "",
        VALID_ACTION_RESPONSES : [ "CREATED",
                                   "RETRIEVED",
                                   "UPDATED",
                                   "DELETED",
                                   "FLUSHED",
                                   "CREATE_FAIL",
                                   "RETRIEVE_FAIL",
                                   "UPDATE_FAIL",
                                   "DELETE_FAIL",
                                   "FLUSH_FAIL" ],
        postscript : function( kwObj )
        {
            this.inherited( arguments );
            if( kwObj )
            {
                lang.mixin( this, kwObj );
            }
        },
        /**
         * Makes a JSON-pure request to url with data as payload. Handles authentication errors:
         *
         * - requires authentication (not authenticated)
         * - access token invalid or expired
         *
         * @param data
         * @public Deferred
         */
        call : function( data )
        {
            var prom = new Deferred();
            prom._requestData = data;
            jsonRequest.post( this.apiUrl, data ).then(
                lang.hitch( this, this._handleResponse, prom ),
                lang.hitch( this, this._handleError, prom ) );
            return prom;
        },
        _handleResponse : function( prom, resp )
        {
            if( !this._isValidResponse( resp ) )
            {
                prom.reject( resp );
            }
            else if( resp.action_str.toUpperCase().indexOf( "_FAIL" ) != -1 )
            {
                if( !this._handleAuthenticationError( prom, resp ) )
                {
                    prom.reject( resp );
                }
                else
                {
                    prom.reject( resp );
                }
            }
            else
            {
                prom.resolve( resp );
            }
        },
        _handleError : function( prom, err )
        {
            console.error( "Unexpected error occurred with request:", err );
            prom.reject( err );
        },
        _isValidResponse : function( resp )
        {
            return this.VALID_ACTION_RESPONSES.indexOf( ( ( resp || {} ).action_str + "" ).toUpperCase() ) != -1;
        },
        _handleAuthenticationError : function( prom, resp )
        {
            var list = resp.log_list || [];
            var authErr = false;
            for( var i = 0; i < list.length; i++ )
            {
                if( list[ i ].code_key == "401" )
                {
                    authErr = list[ i ];
                    break;
                }
            }
            if( authErr && authErr.user_message == "access_key_required" )
            {
                if( cookie( "refresh_token" ) )
                {
                    this._refreshAccessKey( prom );
                }
                else
                {
                    this._redirectToAuthorization();
                }
            }
            else
            {
                return false;
            }
        },
        _refreshAccessKey : function( prom )
        {
            // fetch new access token from token endpoint, then try .call again with prom._requestData, but ONLY ONCE
            // not implemented b/c usergrid tokens have no refresh token
        },
        _redirectToAuthorization : function()
        {
            //if( !confirm( "Redirect to login?" ) ) return;
            window.location.assign( this.authorizationEndpoint + "?return_url=" + encodeURIComponent( this.returnUrl ) ); //TODO: make this more like the real thing
        }
    } );
} );