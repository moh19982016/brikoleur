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
            this.saveButton = new Button({ disabled : true, label : i18n.Accept, "class" : "br-headerButton", iconClass : "fa fa-check-circle br-blue", onClick : lang.hitch( Controller, Controller.saveCharacter ) } ).placeAt( this.buttonContainer );
            this.revertButton = new Button({ disabled : true, label : i18n.Revert, "class" : "br-headerButton br-compactButton br-splitButtonLeft", iconClass : "fa fa-undo", onClick : lang.hitch( Controller, Controller.revertCharacter ) } ).placeAt( this.buttonContainer );
            this.deleteButton = new Button({ disabled : true, label : i18n.Delete, "class" : "br-headerButton br-compactButton br-splitButtonRight", iconClass : "fa fa-trash br-red", onClick : lang.hitch( Controller, Controller.deleteCharacter ) } ).placeAt( this.buttonContainer );
            this.own( this.revertButton, this.saveButton, this.deleteButton );
            this.own( topic.subscribe( "/CharacterSaved/", lang.hitch( this, this.disableSave ) ), topic.subscribe( "/PropertyChanged/", lang.hitch( this, this.checkSave ) ) );
        },
        isValidName : function()
        {
            var name = this.nameInput.get( "value" );
            if( name && Controller.isValidName( name ) )
            {
                this.saveButton.set( "disabled", false );
                return true;
            }
            else
            {
                this.saveButton.set( "disabled", true );
                return !name;
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
        checkSave : function()
        {
            if( Controller.loading )
            {
                return;
            }
            else if( Controller.get( "is_new" ) )
            {
                this.isValidName();
            }
            else
            {
                this.saveButton.set( "disabled", false );
            }
        },
        disableSave : function()
        {
            this.saveButton.set( "disabled", true );
            this.revertButton.set( "disabled", false );
            this.deleteButton.set( "disabled", false );
        },
        get : function( prop )
        {
            if( prop == "state" )
            {
                return {
                    characterName : this.nameInput.get( "value" )
                };
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
                this.disableSave();
            }
            else
            {
                this.inherited( arguments );
            }
        }
    });
});