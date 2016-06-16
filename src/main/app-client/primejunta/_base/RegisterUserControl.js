define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
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
          "dojo/text!./templates/RegisterUserControl.html",
          "dojo/i18n!./nls/UserControls" ],
function( declare,
          lang,
          on,
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
        REGISTER_URL : "register",
        dict : i18n,
        passwordRegExp : "^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$",
        templateString : template,
        postMixInProperties : function()
        {
            this.title = this.title || i18n.Register;
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
                    jsonRequest.post( this.REGISTER_URL, this.submitForm.getValues() ).then(
                    lang.hitch( this, this.handleRegisterResponse ), lang.hitch( this, this.handleRegisterError ) );
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
        handleRegisterResponse : function( resp )
        {
            if( resp.status == "success" )
            {
                var vals = this.submitForm.getValues();
                this.submitForm.reset();
                this.displayMessage( i18n.RegistrationSuccessful );
                setTimeout( lang.hitch( topic, topic.publish, "/PleaseLogin", { username : vals.username, password : vals.password } ), 5000 );
            }
            else if( resp.status == "fail" && resp.cause == "duplicate_unique_property_exists" )
            {
                this.displayMessage( i18n.UserOrEmailExists );
            }
            else
            {
                this.handleRegisterError( resp );
            }
        },
        handleRegisterError : function( err )
        {
            this.displayMessage( i18n.UnexpectedError );
            console.log( "Unexpected error registering user:", err );
        }
    } );
} );