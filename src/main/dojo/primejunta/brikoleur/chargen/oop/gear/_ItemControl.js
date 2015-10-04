/**
 * Control for an individual piece of gear.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dijit/form/CheckBox",
         "dijit/form/Select",
         "dijit/form/TextBox",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!./templates/_ItemControl.html",
         "dojo/i18n!../../../nls/CharGen" ],
function( declare,
          lang,
          topic,
          CheckBox,
          Select,
          TextBox,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        /**
         * Parent.
         *
         * @public Widget
         */
        parent : {},
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
         * Subscribe to topic instructing to lock/unlock remove button.
         *
         * @public void
         */
        postCreate : function()
        {
            this.own( topic.subscribe( "/SetGearRemoveLock/", lang.hitch( this, this._setGearRemoveLock ) ) )
        },
        /**
         * Fires when gear type is chosen.
         *
         * @stub
         * @public void
         */
        chooseType : function()
        {
        },
        /**
         * Requests parent to remove self, then ._publishChange, then destroy.
         *
         * @public void
         */
        pleaseDestroy : function()
        {
            this.parent.pleaseRemoveControl( this );
            this._publishChange();
            this.destroy();
        },
        /**
         * Intercepts "state" and "value", else inherited.
         *
         * @param prop
         * @public {*}
         */
        get : function( /* string */ prop )
        {
            if( prop == "state" )
            {
                return this._getState();
            }
            else if( prop == "value" )
            {
                return this._getValue();
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        /**
         * Intercepts "value" to set UI state to match.
         *
         * @param prop
         * @param val
         * @public void
         */
        set : function( /* string */ prop, /* string */ val )
        {
            if( prop == "value" && val )
            {
                this._setValue( val );
            }
            else
            {
                this.inherited( arguments );
            }
        },
        /**
         * Fires topic informing that inventory has changed.
         *
         * @private void
         */
        _publishChange : function()
        {
            topic.publish( "/PropertyChanged/", "inventory", this.get( "value" ) );
        },
        /**
         * Sets disabled on .deleteButton to match to.
         *
         * @param to
         * @private void
         */
        _setGearRemoveLock : function( /* boolean */ to )
        {
            this.deleteButton.set( "disabled", to );
        },
        /**
         * Returns object with value retrieved via ._getValue.
         *
         * @private Object
         */
        _getState : function()
        {
            return { value : this.get( "value" ) };
        },
        /**
         * Returns state of UI controls as bar-separated list string.
         *
         * @private string
         */
        _getValue : function()
        {
            return this.activeControl.get( "checked" ) + "|" + this.typeSelect.get( "value" ) + "|" + this.levelInput.get( "value" ) + "|" + this._esc( this.descriptionInput.get( "value" ) );
        },
        /**
         * Sets UI state from bar-separated list string in val.
         *
         * @param val
         * @private void
         */
        _setValue : function( /* string */ val )
        {
            var values = val.split( "|" );
            this.activeControl.set( "checked", values[ 0 ] == "true" );
            this.typeSelect.set( "value", values[ 1 ] );
            this.levelInput.set( "value", parseInt( values[ 2 ] ) );
            this.descriptionInput.set( "value", this._unesc( values[ 3 ] ) );
        },
        /**
         * Escapes bars in str.
         *
         * @param str
         * @private string
         */
        _esc : function( str )
        {
            return str.replace( /\|/g, "&bar;" );
        },
        /**
         * Unescapes bar patterns in str.
         *
         * @param str
         * @private string
         */
        _unesc : function( str )
        {
            return str.replace( /\&bar;/g, "|" );
        }
    });
});