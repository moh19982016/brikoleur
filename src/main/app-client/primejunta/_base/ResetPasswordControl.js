define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/string",
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
          "dojo/text!./templates/ResetPasswordControl.html",
          "dojo/i18n!./nls/UserControls" ],
function( declare,
          lang,
          on,
          string,
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
        dict : i18n,
        passwordRegExp : "^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$",
        returnUrl : "",
        token : "",
        username : "",
        displayName : "",
        status : "ok",
        templateString : template,
        postMixInProperties : function()
        {
            this.title = this.title || i18n.ResetPassword;
            this.displayName = this.displayName || this.username;
            this.resetMessage = string.substitute( i18n.ResetPasswordMessage, { displayName : this.displayName } );
        },
        postCreate : function()
        {
            if( this.status == "ok" )
            {
                this.submitForm.domNode.style.display = "block";
            }
            else
            {
                this.statusWrapper.style.display = "block";
                this.statusMessage.innerHTML = string.substitute( i18n.CantResetPasswordMessage, { returnUrl : this.returnUrl } );
            }
        },
        submit : function()
        {
            this.displayMessage( "" );
            if( this.submitForm.validate() )
            {
                var vals = this.submitForm.getValues();
                if( vals.password != vals.repeatPassword )
                {
                    this.displayMessage( i18n.PasswordsDontMatch );
                }
                else
                {
                    this.submitForm.domNode.style.display = "none";
                    jsonRequest.post( this.API_URL, util.getRequestMessage( "update", "password", {
                        username : this.username,
                        token : this.token,
                        password : vals.password
                    } ) ).then(
                        lang.hitch( this, this.handleResetResponse ),
                        lang.hitch( this, this.handleResetError )
                    );
                }
            }
        },
        displayMessage : function( message, target )
        {
            if( !target )
            {
                this.messageNode.innerHTML = message;
                return;
            }
            Tooltip.show( message, target.domNode || target );
            setTimeout( function()
            {
                on.once( document.body, "click", function()
                {
                    Tooltip.hide( target.domNode || target );
                } );
            }, 1 )
        },
        handleResetResponse : function( resp )
        {
            if( resp.action_str == "updated" )
            {
                var vals = this.submitForm.getValues();
                this.submitForm.reset();
                this.displayMessage( string.substitute( i18n.ResetSuccessful, { returnUrl : this.returnUrl } ) );
            }
            else
            {
                this.handleResetError( resp );
            }
        },
        handleResetError : function( err )
        {
            if( util.hasStatus( err, "user_msg", "no_valid_token" ) )
            {
                this.displayMessage( string.substitute( i18n.CantResetPasswordMessage, { returnUrl : this.returnUrl } ) );
            }
            else
            {
                this.displayMessage( i18n.UnexpectedError );
                console.error( "Unexpected error resetting password:", err );
            }
        }
    } );
} );