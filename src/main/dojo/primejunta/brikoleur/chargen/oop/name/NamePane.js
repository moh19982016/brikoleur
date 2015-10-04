/**
 * Character name pane. This also controls the UI for saving, deleting, and reloading the character.
 *
 * @public Widget
 */
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
        /**
         * Localization.
         *
         * @final
         * @public Object
         */
        dict : i18n,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Connect validator functions and messages to .nameInput, set up buttons for saving, reverting, and deleting
         * the character, and subscribe to topics indicating a character was saved or a property was changed, which will
         * disable/enable the save button.
         *
         * Note that we leave it intentionally enabled even for invalid characters, since clicking it will bring up a
         * helpful tip on what's missing.
         *
         * @public void
         */
        postCreate : function()
        {
            this.nameInput.isValid = lang.hitch( this, this.isValidName );
            this.nameInput.invalidMessage = i18n.NameInUse;
            this.saveButton = new Button({ disabled : true, label : i18n.Accept, "class" : "br-headerButton", iconClass : "fa fa-check-circle br-blue", onClick : lang.hitch( Controller, Controller.saveCharacter ) } ).placeAt( this.buttonContainer );
            this.revertButton = new Button({ disabled : true, label : i18n.Revert, "class" : "br-headerButton br-compactButton br-splitButtonLeft", iconClass : "fa fa-undo", onClick : lang.hitch( Controller, Controller.revertCharacter ) } ).placeAt( this.buttonContainer );
            this.deleteButton = new Button({ disabled : false, label : i18n.Delete, "class" : "br-headerButton br-compactButton br-splitButtonRight", iconClass : "fa fa-trash br-red", onClick : lang.hitch( Controller, Controller.deleteCharacter ) } ).placeAt( this.buttonContainer );
            this.own( this.revertButton, this.saveButton, this.deleteButton );
            this.own( topic.subscribe( "/CharacterSaved/", lang.hitch( this, this.disableSave ) ), topic.subscribe( "/PropertyChanged/", lang.hitch( this, this.checkSave ) ) );
        },
        /**
         * If a name has been provided and Controller.isValidName is true, enable save button and return true. Else
         * disable save button and return true if no name has been given (since it's not actually invalid, just
         * missing.)
         *
         * @public boolean
         */
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
        /**
         * Names for new and existing characters are validated differently; the former are also checked against the list
         * of saved characters to prevent duplicates.
         *
         * @public Object - valid : {boolean}, message : {string}
         */
        validate : function()
        {
            if( this.nameInput.get( "value" ) && ( !Controller.is_new || this.isValidName() ) )
            {
                return {
                    valid : true
                }
            }
            else
            {
                return {
                    valid : false,
                    message : i18n.NeedName
                }
            }
        },
        /**
         * Tunnel to Controller.saveCharacter.
         *
         * @public void
         */
        saveCharacter : function()
        {
            Controller.saveCharacter();
        },
        /**
         * Tunnel to Controller.deleteCharacter.
         *
         * @public void
         */
        deleteCharacter : function()
        {
            Controller.deleteCharacter();
        },
        /**
         * Tunnel to Controller.revertCharacter.
         *
         * @public void
         */
        revertCharacter : function()
        {
            Controller.revertCharacter();
        },
        /**
         * Set save button's disabled state depending on whether we're allowing saves for the current character, which
         * in turn depends on name and whether it's a new or existing one.
         *
         * @public void
         */
        checkSave : function()
        {
            if( Controller.loading )
            {
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
        /**
         * Disable save button, enable delete and revert buttons.
         *
         * @public void
         */
        disableSave : function()
        {
            this.saveButton.set( "disabled", true );
            this.revertButton.set( "disabled", false );
            this.deleteButton.set( "disabled", false );
        },
        /**
         * Intercept state to return an Object containing characterName.
         *
         * @param prop
         * @public Object
         */
        get : function( /* string */ prop )
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
        /**
         * Intercept "state" to set characterName from val. If it's not a template (=archetype, from splash screen),
         * also disable it (we can't change names for existing characters), and .disableSave.
         *
         * @param prop
         * @param val
         * @public void
         */
        set : function( /* string */ prop, /* {*} */ val )
        {
            if( prop == "state" )
            {
                this.nameInput.set( "value", val.characterName );
                if( !val.is_template )
                {
                    this.nameInput.set( "disabled", true );
                    this.disableSave();
                }
            }
            else
            {
                this.inherited( arguments );
            }
        }
    });
});