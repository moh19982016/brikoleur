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
        },
        isValidName : function()
        {
            var name = this.nameInput.get( "value" );
            console.log( "NAME IS", name );

            if( name && Controller.isValidName( name ) )
            {
                this.saveButton.set( "disabled", false );
                return true;
            }
            else
            {
                this.saveButton.set( "disabled", true );
            }
        },
        saveCharacter : function()
        {
            Controller.saveCharacter();
        },
        deleteCharacter : function()
        {
            Controller.deleteCharacter();
        },
        revertCharacter : function()
        {
            Controller.revertCharacter();
        },
        get : function( prop )
        {
            if( prop == "state" )
            {
                return {
                    characterName : this.nameInput.get( "value" ),
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
                this.revertButton.set( "disabled", false );
                this.deleteButton.set( "disabled", false );
            }
            else
            {
                this.inherited( arguments );
            }
        }
    });
});