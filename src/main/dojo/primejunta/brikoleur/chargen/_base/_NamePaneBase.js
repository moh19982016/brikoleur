/**
 * Character name pane. This also controls the UI for saving, deleting, and reloading the character.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dijit/form/ValidationTextBox",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!./templates/_NamePaneBase.html",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          ValidationTextBox,
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
                this._setState( val );
            }
            else
            {
                this.inherited( arguments );
            }
        },
        _setState : function( state )
        {
            this.nameInput.set( "value", state.characterName );
            if( !state.is_template )
            {
                this.nameInput.set( "disabled", true );
            }
        }
    });
});