/**
 * Character name pane. This also controls the UI for saving, deleting, and reloading the character.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dijit/form/Button",
          "../../_base/_NamePaneBase",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          Button,
          _NamePaneBase,
          i18n )
{
    return declare( [ _NamePaneBase ], {
        /**
         * Pane type (OOP or IP).
         *
         * @final
         * @public string
         */
        pt : "OOP",
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
            this.saveButton =
            new Button( {
                disabled : true,
                label : i18n.Accept,
                "class" : "br-headerButton alt-primary",
                iconClass : "fa fa-check-circle fa-inverse",
                onClick : lang.hitch( Controller, Controller.saveCharacter )
            } ).placeAt( this.buttonContainer );
            this.own( this.saveButton );
            this.own( topic.subscribe( "/CharacterSaved/", lang.hitch( this, this.disableSave ) ),
            topic.subscribe( "/PropertyChanged/", lang.hitch( this, this.checkSave ) ) );
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
        },
        /**
         * Inherited, then .disableSave.
         *
         * @param state
         * @private void
         */
        _setState : function( state )
        {
            this.inherited( arguments );
            this.disableSave();
        }
    } );
} );