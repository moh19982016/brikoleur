define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
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
        TOKEN_ENDPOINT : "login",
        RESET_PASSWORD_URL : "resetpw",
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
                //this.submitForm.reset();
                this.pleaseLogin( vals );
            }
        },
        handleLoginResponse : function( resp )
        {
            if( resp.status == "success" )
            {
                if( !confirm( "Return to app?" ) ) return;
                window.location.assign( this.REDIRECT_URL ); // forget about state for now
            }
            else if( resp.status == "fail" && resp.cause == "invalid_grant" )
            {
                this.displayMessage( i18n.LoginFailed );
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
            jsonRequest.post( this.RESET_PASSWORD_URL, {
                locale : dojoConfig.locale,
                user : this.usernameField.get( "value" ) }
            ).then( lang.hitch( this, this.handleResetResponse ), lang.hitch( this, this.handleResetError ) );
        },
        handleResetResponse : function( resp )
        {
            if( resp.status == "success" )
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
            jsonRequest.post( this.TOKEN_ENDPOINT, credentials ).then(
            lang.hitch( this, this.handleLoginResponse ), lang.hitch( this, this.handleLoginError ) );
        }
    } );
} );