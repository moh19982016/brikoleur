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
        register : function( req )
        {
            var jsonMessage = req._jsonMessage || {};
            delete jsonMessage.repeatPassword;
            return jsonRequest.post( serverConfig.usergrid.url + "/udwc/brikoleur/users", jsonMessage ).then(
                lang.hitch( this, function( _resp )
                {
                    return new Deferred().resolve({
                        body :  {
                            "status" : "success"
                        }
                    } );
                }), lang.hitch( this, this._handleAuthError, "duplicate_unique_property_exists" ) );
        },
        login : function( req )
        {
            var jsonMessage = req._jsonMessage || {};
            return jsonRequest.post( this.TOKEN_ENDPOINT, {
                grant_type : "password",
                username : jsonMessage.username,
                password : jsonMessage.password
            } ).then( lang.hitch( this, function( _resp )
            {
                console.log( "GOT TOKEN", _resp.access_token );
                return new Deferred().resolve( {
                    body : {
                        status : "success"
                    },
                    headers : {
                        "Set-Cookie" : cookie.serialize( "access_token", _resp.access_token, {
                            httpOnly : true, expires : new Date( new Date().getTime() + ( _resp.expires_in ) * 1000 )
                        } )
                    }
                } );
            } ), lang.hitch( this, this._handleAuthError, "invalid_grant" ) );
        },
        requestResetPassword : function( req )
        {
            var jsonMessage = req._jsonMessage || {};
            return this._fetchUser( jsonMessage.user ).then( lang.hitch( this, function( user )
            {
                var email = user.email;
                if( !email )
                {
                    return new Deferred().resolve( { body :  { "error" : "no_email" } } );
                }
                else
                {
                    user.now = new Date();
                    user.salt = ",.nn,asf knhjsadfui756fsh43 hjaku2ﬁª d˛√ﬁªa afl.";
                    var tkn = hash( user );
                    var link = serverConfig.users.resetpw.url + ".html?user=" + encodeURIComponent( user.username ) + "&token=" + tkn + "&locale=" + ( jsonMessage.locale || "en" );
                    return this._applicationClient.put( this.PWRESET_PATH + "/" + jsonMessage.user, { "pwreset" : tkn, "pwresettime" : new Date().getTime() } ).then( lang.hitch( this, function()
                    {
                        util.sendMail({
                            to : email,
                            subject : i18n.ResetPassword,
                            text : string.substitute( i18n.ResetPasswordMessage, { link : link } ),
                            html : string.substitute( i18n.ResetPasswordMessageHTML, { link : link } )
                        } );
                        return new Deferred().resolve( { body : { "status" : "success" } } );
                    } ), lang.hitch( this, this._handleResetError ) );
                }
            } ), lang.hitch( this, this._handleResetError ) );
        },
        serveResetPasswordForm : function( req )
        {
            var props = this._parseResetProps( req.url );
            return this._fetchUser( props.user ).then( lang.hitch( this, function( user )
            {
                if( this._tokenIsValid( props.token, user ))
                {
                    return new Deferred().resolve( {
                        body : string.substitute( resetPasswordForm, {
                            locale : props.locale,
                            token : props.token,
                            user : props.user,
                            status : "ok",
                            returnUrl : serverConfig.users.resetpw.returnUrl
                        } ),
                        contentType : "text/html"
                    } );
                }
                else
                {
                    return new Deferred().resolve( {
                        body : string.substitute( resetPasswordForm, {
                            locale : props.locale,
                            token : props.token,
                            user : props.user,
                            status : "failed",
                            returnUrl : serverConfig.users.resetpw.returnUrl
                        } ),
                        contentType : "text/html"
                    } );
                }
            } ),
            lang.hitch( this, this._handleResetError ) );
        },
        setPassword : function( req )
        {
            var jsonMessage = req._jsonMessage || {};
            return this._fetchUser( jsonMessage.user ).then( lang.hitch( this, function( user )
            {
                if( this._tokenIsValid( jsonMessage.token, user ) )
                {
                    return this._applicationClient.put( this.PWRESET_PATH + "/" + jsonMessage.user, {
                        "pwreset" : "", "pwresettime" : ""
                    } ).then( lang.hitch( this, function()
                    {
                        return this._applicationClient.put( this.PWRESET_PATH + "/" + jsonMessage.user + "/password", {
                            newpassword : jsonMessage.password
                        } ).then( lang.hitch( this, function( reslt )
                        {
                            return new Deferred().resolve( { body : { status : "success" } } );
                        } ), lang.hitch( this, this._handleResetError ) );
                    } ), lang.hitch( this, this._handleResetError ) );
                }
                else
                {
                    return new Deferred().resolve( { body : { status : "fail", cause : "no_valid_token" } } );
                }
            } ), lang.hitch( this, this._handleResetError ) );
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
                if( props.user && props.token && props.locale )
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
        _initAppClient : function()
        {

        },
        _handleResetError : function()
        {
            return new Deferred().resolve( {
                body : {
                    "status" : "fail",
                    "cause" : "user_not_found"
                }
            } );
        },
        _handleAuthError : function( handledError, err )
        {
            try
            {
                var msg = JSON.parse( err.response.text );
                if( msg.error == handledError )
                {
                    return new Deferred().resolve({
                        body : {
                            "status" : "fail",
                            "cause" : handledError
                        }
                    } );
                }
                else
                {
                    return new Deferred().reject( err );
                }
            }
            catch( e )
            {
                return new Deferred().reject( err );
            }
        }
    });
});