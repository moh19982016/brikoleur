/**
 * Control for an individual piece of gear.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/on",
         "dojo/topic",
         "dojo/dom-class",
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
          on,
          topic,
          domClass,
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
        type : "gear",
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
         * Sets listener for clicks, which will publish topic picked up by _ItemHeader, setting the header to match
         * the item. Then set levelInput and .recalcValues().
         *
         * @public void
         */
        postCreate : function()
        {
            this.own( on( this.domNode, "click", lang.hitch( this, function() {
                topic.publish( "/InventoryItemClicked/", this.type );
            })));
            this.levelInput.set( "value", this.level || 0 );
            this.recalcValues();
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
         * If attachPoint has no value or has a calculated value, replaces it with nVal and marks it with CSS as
         * calculated. Else unmarks CSS. Finally _publishChange so the save button is activated.
         *
         * @param attachPoint
         * @param nVal
         * @param cVal
         * @public void
         */
        setField : function( /* string */ attachPoint, /* int */ nVal, /* int */ cVal )
        {
            if( isNaN( this[ attachPoint ].get( "value" ) ) || this[ attachPoint ].get( "value" ) == cVal )
            {
                this[ attachPoint ].set( "value", nVal );
                this.markCalculated( this[ attachPoint ], true );
            }
            else
            {
                this.markCalculated( this[ attachPoint ], false );
            }
            this._publishChange();
        },
        /**
         * Stub. Connect something here to recalculate values.
         *
         * @stub
         * @public void
         */
        recalcValues : function()
        {
        },
        /**
         * Tags/untags field with suitable CSS class, if isCalculated or not.
         *
         * @public void
         */
        markCalculated : function( /* TextBox */ field, /* boolean */ isCalculated )
        {
            isCalculated ? domClass.add( field.domNode, "br-calculatedValue" ) : domClass.remove( field.domNode, "br-calculatedValue" );
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
            else if( prop == "type" )
            {
                this.displayType( val );
                this.type = val;
            }
            else
            {
                this.inherited( arguments );
            }
        },
        /**
         * Displays localized type in .typeDisplayNode. Override or disconnect if doing this differently.
         *
         * @param type
         * @public void
         */
        displayType : function( /* string */ type )
        {
            this.typeDisplayNode.innerHTML = i18n[ type ] || i18n.gear;
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
            return {
                carried : this.activeControl.get( "checked" ),
                type : this.get( "type" ),
                level : this.levelInput.get( "value" ),
                description : this.descriptionInput.get( "value" )
            };
        },
        /**
         * Sets UI state from bar-separated list string in val.
         *
         * @param props
         * @private void
         */
        _setValue : function( /* Object */ props )
        {
            props = props || {};
            this.activeControl.set( "checked", props.carried );
            this.set( "type", props.type );
            this.itemType = props.itemType || this.itemType;
            this.level = props.level || this.level;
            this.levelInput.set( "value", props.level );
            this.descriptionInput.set( "value", props.description );
        }
    });
});