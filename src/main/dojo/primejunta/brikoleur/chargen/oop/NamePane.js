define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "dijit/form/ValidationTextBox",
        "dijit/form/Button",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/NamePane.html",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          ValidationTextBox,
          Button,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        dict : i18n,
        templateString : template,
        postCreate : function()
        {
            this.nameInput.isValid = lang.hitch( this, this.isValidName );
            this.nameInput.invalidMessage = i18n.NameInUse;
            this.own( topic.subscribe( "/PleasePublishStatus/", lang.hitch( this, this.publishStatus ) ) );
        },
        isValidName : function( name )
        {
            if( Controller.isValidName( name ) )
            {
                this.saveButton.set( "disabled", false );
                return true;
            }
            else
            {
                this.saveButton.set( "disabled", true );
            }
        },
        publishJuju : function()
        {
            if( !Controller.loading )
            {
                this.publishStatus();
            }
        },
        publishStatus : function()
        {
            topic.publish( "/StatChanged/-juju", this.jujuInput.get( "value" ) );
        },
        saveCharacter : function()
        {
            Controller.saveCharacter();
        },
        get : function( prop )
        {
            if( prop == "state" )
            {
                return {
                    characterName : this.nameInput.get( "value" ),
                    juju : this.jujuInput.get( "value" )
                }
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        set : function( prop, val )
        {
            if( prop == "state" )
            {
                this.nameInput.set( "value", val.characterName );
                this.nameInput.set( "disabled", true );
                this.saveButton.set( "disabled", false );
                this.jujuInput.set( "value", val.juju );
            }
            else
            {
                this.inherited( arguments );
            }
        }
    });
});