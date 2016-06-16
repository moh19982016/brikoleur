define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/string",
         "dojo/Deferred",
         "dojo/io-query",
         "./util",
         "app/primejunta/_base/json-request",
         "app-server/primejunta/_base/ApplicationClient",
         "dojo/node!cookie",
         "dojo/node!object-hash",
         "dojo/text!./templates/ResetPasswordForm.html",
         "dojo/i18n!./nls/UsergridClient" ],
function( declare,
          lang,
          string,
          Deferred,
          ioQuery,
          util,
          jsonRequest,
          ApplicationClient,
          cookie,
          hash,
          resetPasswordForm,
          i18n )
{
    return declare( "app-server/primejunta/_base/UserManager", [], {
        TOKEN_ENDPOINT : serverConfig.usergrid.url + "/" + serverConfig.usergrid.organizationName + "/" + serverConfig.usergrid.applicationName + "/token",
        PWRESET_PATH : "/" + serverConfig.usergrid.organizationName + "/" + serverConfig.usergrid.applicationName + "/users",
        postscript : function()
        {
            this._applicationClient = new ApplicationClient( { mode : "application" } );
        },
        authenticate : function( req )
        {
            return this.parseRequest( req ).then(
                lang.hitch( this, function( parsedRequest )
                {
                    if( parsedRequest.action_str == "create" )
                    {
                        if( parsedRequest.data_type == "access_token" )
                        {
                            return this.login( req, parsedRequest );
                        }
                        else if( parsedRequest.data_type == "password_reset_token" )
                        {
                            return this.requestPasswordReset( req, parsedRequest );
                        }
                        else if( parsedRequest.data_type == "user" )
                        {
                            return this.registerUser( req, parsedRequest );
                        }
                    }
                    else if( parsedRequest.action_str == "update" )
                    {
                        return this.setPassword( req, parsedRequest );
                    }
                    else
                    {
                        return this._handleAuthError( req, false );
                    }
                } ),
                lang.hitch( this, this._handleAuthError, req, false ) );
        },
        parseRequest : function( req )
        {
            return util.parseRequest( req, [ "access_token", "password_reset_token", "password", "user" ] ).then( lang.hitch( this, function( parsedRequest )
            {
                if( parsedRequest.action_str == "create"
                    && parsedRequest.data_type == "access_token"
                    && ( !parsedRequest.request_map.username
                         || !parsedRequest.request_map.password ) )
                {
                    return util.rejectRequest( "missing_username_or_password" );
                }
                else if( parsedRequest.action_str == "create"
                         && parsedRequest.data_type == "password_reset_token"
                         && !parsedRequest.request_map.username )
                {
                    return util.rejectRequest( "missing_username" );
                }
                else if( parsedRequest.action_str == "create"
                         && parsedRequest.data_type == "user"
                         && ( !parsedRequest.request_map.username
                              || !parsedRequest.request_map.password ) )
                {
                    return util.rejectRequest( "invalid_user_data" );
                }
                else if( parsedRequest.action_str == "update"
                         && parsedRequest.data_type == "password"
                         && ( !parsedRequest.request_map.username
                              || !parsedRequest.request_map.token
                              || !parsedRequest.request_map.password ) )
                {
                    return util.rejectRequest( "missing_username_token_or_password" );
                }
                else
                {
                    return new Deferred().resolve( parsedRequest );
                }
            }));
        },
        registerUser : function( req, parsedRequest )
        {
            return jsonRequest.post( serverConfig.usergrid.url + "/udwc/brikoleur/users", parsedRequest.request_map ).then(
                lang.hitch( this, function( _resp )
                {
                    return new Deferred().resolve({
                        body :  util.getResponseMessage( req )
                    } );
                } ), lang.hitch( this, this._handleAuthError, req, "duplicate_unique_property_exists" ) );
        },
        login : function( req, parsedRequest )
        {
            var jsonMessage = parsedRequest.request_map;
            if( !jsonMessage || !jsonMessage.username || !jsonMessage.password )
            {
                return this._handleAuthError( req, "invalid_request" );
            }
            return jsonRequest.post( this.TOKEN_ENDPOINT, {
                grant_type : "password",
                username : jsonMessage.username,
                password : jsonMessage.password
            } ).then( lang.hitch( this, function( _resp )
            {
                return new Deferred().resolve( {
                    body : util.getResponseMessage( req ),
                    headers : {
                        "Set-Cookie" : cookie.serialize( "access_token", _resp.access_token, {
                            httpOnly : true, expires : new Date( new Date().getTime() + ( _resp.expires_in ) * 1000 )
                        } )
                    }
                } );
            } ), lang.hitch( this, this._handleAuthError, req, "invalid_grant" ) );
        },
        requestPasswordReset : function( req, parsedRequest )
        {
            return this._fetchUser( parsedRequest.request_map.username ).then( lang.hitch( this, function( user )
            {
                var email = user.email;
                if( !email )
                {
                    return new Deferred().resolve( {
                        body :  util.getErrorMessage( req, "404", "not_found", "no_email", 1 )
                    } );
                }
                else
                {
                    user.now = new Date();
                    user.salt = ",.nn,asf knhjsadfui756fsh43 hjaku2ﬁª d˛√ﬁªa afl.";
                    var tkn = hash( user );
                    var link = serverConfig.users.resetpw.url + ".html?username=" + encodeURIComponent( user.username ) + "&token=" + tkn + "&locale=" + ( parsedRequest.locale || "en" );
                    return this._applicationClient.put( this.PWRESET_PATH + "/" + user.username, { "pwreset" : tkn, "pwresettime" : new Date().getTime() } ).then( lang.hitch( this, function()
                    {
                        util.sendMail({
                            to : email,
                            subject : i18n.ResetPassword,
                            text : string.substitute( i18n.ResetPasswordMessage, { link : link } ),
                            html : string.substitute( i18n.ResetPasswordMessageHTML, { link : link } )
                        } );
                        return new Deferred().resolve( { body : util.getResponseMessage( req ) } );
                    } ) );
                }
            } ), lang.hitch( this, this._handleAuthError, req, false ) );
        },
        serveResetPasswordForm : function( req )
        {
            var props = this._parseResetProps( req.url );
            if( !props )
            {
                return this._failPasswordResetForm( "en" );
            }
            return this._fetchUser( props.username ).then( lang.hitch( this, function( user )
            {
                if( this._tokenIsValid( props.token, user ))
                {
                    return this._serveResetPasswordForm( {
                        locale : props.locale,
                        token : props.token,
                        username : props.username,
                        displayName : user.name,
                        status : "ok",
                        returnUrl : serverConfig.users.resetpw.returnUrl
                    } );
                }
                else
                {
                    return this._failPasswordResetForm( props.locale );
                }
            } ),
            lang.hitch( this, this._failPasswordResetForm, props.locale ) );
        },
        _serveResetPasswordForm : function( kwObj )
        {
            return new Deferred().resolve( {
                body : string.substitute( resetPasswordForm, kwObj ),
                contentType : "text/html"
            } );
        },
        _failPasswordResetForm : function( locale )
        {
            return this._serveResetPasswordForm({
                locale : locale || "en",
                token : "",
                username : "",
                displayName : "",
                status : "failed",
                returnUrl : serverConfig.users.resetpw.returnUrl
            });
        },
        setPassword : function( req, parsedRequest )
        {
            return this._fetchUser( parsedRequest.request_map.username ).then( lang.hitch( this, function( user )
            {
                if( this._tokenIsValid( parsedRequest.request_map.token, user ) )
                {
                    return this._applicationClient.put( this.PWRESET_PATH + "/" + parsedRequest.request_map.username, {
                        "pwreset" : "", "pwresettime" : ""
                    } ).then( lang.hitch( this, function()
                    {
                        return this._applicationClient.put( this.PWRESET_PATH + "/" + parsedRequest.request_map.username + "/password", {
                            newpassword : parsedRequest.request_map.password
                        } ).then( lang.hitch( this, function( reslt )
                        {
                            return new Deferred().resolve( { body : util.getResponseMessage( req ) } );
                        } ) );
                    } ) );
                }
                else
                {
                    return new Deferred().resolve( { body : util.getErrorMessage( req, 404, "not_found", "no_valid_token", 2 ) } );
                }
            } ), lang.hitch( this, this._handleAuthError, req, false ) );
        },
        _tokenIsValid : function( token, user )
        {
            return token == user.pwreset && new Date().getTime() < user.pwresettime + serverConfig.users.resetpw.expires * 1000
        },
        _fetchUser : function( userIdentifier )
        {
            return this._applicationClient.get( this.PWRESET_PATH + "/" + userIdentifier ).then(
            lang.hitch( this, function( resp )
            {
                if( resp && resp.entities && resp.entities[ 0 ] )
                {
                    return new Deferred().resolve( resp.entities[ 0 ] );
                }
                else
                {
                    return new Deferred().reject();
                }
            } ) );
        },
        _parseResetProps : function( url )
        {
            try
            {
                var props = ioQuery.queryToObject( url.substring( url.indexOf( "?" ) + 1 ) );
                if( props.username && props.token && props.locale )
                {
                    return props;
                }
                else
                {
                    return false;
                }
            }
            catch( e )
            {
                return false;
            }
        },
        _handleAuthError : function( req, handledError, err )
        {
            if( err && err.response && err.response.text )
            {
                try
                {
                    var msg = JSON.parse( err.response.text );
                    if( msg.error == handledError )
                    {
                        return new Deferred().resolve( {
                            body : util.getErrorMessage( req, 401, "authorization_failed", handledError, 2 )
                        } );
                    }
                    else
                    {
                        return new Deferred().resolve( {
                            body : util.getErrorMessage( req )
                        } );
                    }
                }
                catch( e )
                {
                    return new Deferred().resolve( {
                        body : util.getErrorMessage( req )
                    } );
                }
            }
            else if( err && err instanceof Array )
            {
                return new Deferred().resolve( {
                    body : util.getResponseMessage( req, false, err, true )
                } );
            }
        }
    });
});