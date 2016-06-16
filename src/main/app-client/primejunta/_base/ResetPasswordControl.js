define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/string",
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
        SET_PASSWORD_URL : "setpw",
        dict : i18n,
        passwordRegExp : "^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$",
        returnUrl : "",
        token : "",
        user : "",
        status : "ok",
        templateString : template,
        postMixInProperties : function()
        {
            this.title = this.title || i18n.ResetPassword;
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
                    jsonRequest.post( this.SET_PASSWORD_URL, {
                        user : this.user,
                        token : this.token,
                        password : vals.password
                    } ).then(
                    lang.hitch( this, this.handleResetResponse ), lang.hitch( this, this.handleResetError ) );
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
            if( resp.status == "success" )
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
            this.displayMessage( i18n.UnexpectedError );
            console.log( "Unexpected error registering user:", err );
        }
    } );
} );