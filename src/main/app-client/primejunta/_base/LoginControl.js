define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "./util",
          "dijit/form/Form",
          "dijit/form/TextBox",
          "dijit/form/ValidationTextBox",
          "dijit/form/Button",
          "app/primejunta/_base/json-request",
          "dijit/Tooltip",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dijit/_WidgetsInTemplateMixin",
          "dojo/text!./templates/LoginControl.html",
          "dojo/i18n!./nls/UserControls" ],
function( declare,
          lang,
          topic,
          util,
          Form,
          TextBox,
          ValidationTextBox,
          Button,
          jsonRequest,
          Tooltip,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        API_URL : "authenticate",
        REDIRECT_URL : "hello.html",
        dict : i18n,
        templateString : template,
        postMixInProperties : function()
        {
            this.title = this.title || i18n.Login;
            this.own( topic.subscribe( "/PleaseLogin", lang.hitch( this, this.pleaseLogin ) ) );
        },
        submit : function()
        {
            this.displayMessage( "" );
            if( this.submitForm.validate() )
            {
                var vals = this.submitForm.getValues();
                this.pleaseLogin( vals );
            }
        },
        handleLoginResponse : function( resp )
        {
            if( resp.action_str == "created" )
            {
                if( !confirm( "Return to app?" ) ) return;
                window.location.assign( this.REDIRECT_URL ); // forget about state for now
            }
            else if( util.hasStatus( resp, "user_msg", "invalid_grant" ) )
            {
                this.displayMessage( i18n.LoginFailed );
            }
            else
            {
                this.handleLoginError( resp );
            }
        },
        handleLoginError : function( err )
        {
            this.displayMessage( i18n.UnexpectedError );
            console.log( "Unexpected error in login:", err );
        },
        checkControls : function()
        {
            if( this.usernameField.get( "value" ) )
            {
                this.resetPasswordButton.style.visibility = "visible";
                if( this.passwordField.get( "value" ) )
                {
                    this.loginButton.set( "disabled", false );
                }
                else
                {
                    this.loginButton.set( "disabled", true );
                }
            }
            else
            {
                this.resetPasswordButton.style.visibility = "hidden";
                this.loginButton.set( "disabled", true );
            }
        },
        resetPassword : function()
        {
            jsonRequest.post( this.API_URL, util.getRequestMessage( "create", "password_reset_token", {
                locale : dojoConfig.locale,
                username : this.usernameField.get( "value" )
            } ) ).then( lang.hitch( this, this.handleResetResponse ), lang.hitch( this, this.handleResetError ) );
        },
        handleResetResponse : function( resp )
        {
            if( resp.action_str == "created" )
            {
                this.displayMessage( i18n.ResetMessageSent );
            }
            else
            {
                this.displayMessage( i18n.CouldntSendResetMessage );
            }
        },
        handleResetError : function( err )
        {
            this.displayMessage( i18n.UnexpectedError );
        },
        displayMessage : function( msg )
        {
            this.messageNode.innerHTML = msg;
        },
        pleaseLogin : function( credentials )
        {
            jsonRequest.post( this.API_URL, util.getRequestMessage( "create", "access_token", credentials ) ).then(
            lang.hitch( this, this.handleLoginResponse ), lang.hitch( this, this.handleLoginError ) );
        }
    } );
} );