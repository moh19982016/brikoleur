/**
 * Control for managing trait features, such as Zonetouched gifts and curses or Genetically Engineered adaptations.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dojo/store/Memory",
         "dijit/form/ComboBox",
         "dijit/form/Button",
         "dijit/form/Select",
         "dijit/form/TextBox",
         "./../_base/util",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!./templates/_TraitFeatureControl.html",
         "dojo/i18n!./../../../nls/CharGen" ],
function( declare,
          lang,
          topic,
          Memory,
          ComboBox,
          Button,
          Select,
          TextBox,
          util,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        /**
         * Control to which this sub-widget belongs.
         *
         * @public Widget
         */
        manager : {},
        /**
         * Key identifying the trait to which the feature belongs.
         *
         * @public string
         */
        key : "",
        /**
         * How many are we allowed?
         *
         * @public int
         */
        max : 1,
        /**
         * Do we have a selector?
         *
         * @public boolean
         */
        selector : true,
        /**
         * What's the value (use .get and .set), don't access directly?
         *
         * @public string
         */
        value : "",
        /**
         * List of possible values for the selector, if applicable.
         *
         * @public Object[]
         */
        list : false,
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
         * Show type controls unless .selector is set. If list is set, create a store for it and make a ComboBox to
         * control it. If there is no list, just make a TextBox. Initialize ._count, and subscribe to /AddFreeFeature/
         * to .checkCap.
         *
         * @public void
         */
        postCreate : function()
        {
            if( !this.selector )
            {
                this.typeNode.innerHTML = this.value;
                this.typeNode.style.display = "inline";
                this.typeSelect.domNode.style.display = "none";
            }
            if( this.list )
            {
                var store = new Memory({ data : util.listToStoreData( this.list )});
                this.valueInput = new ComboBox({ onChange : lang.hitch( this, this.checkAdd ), style : "width:100%", store : store, placeholder : i18n.SelectOrType } ).placeAt( this.valueInputNode );
                this.own( store );
            }
            else
            {
                this.valueInput = new TextBox({ onChange : lang.hitch( this, this.checkAdd ), style : "width:100%" } ).placeAt( this.valueInputNode );
            }
            this._count = 0;
            this.own( this.valueInput, topic.subscribe( "/AddFreeFeature/", lang.hitch( this, this.checkCap ) ) );
        },
        /**
         * Return .max.
         *
         * @stub
         * @public int
         */
        checkMax : function()
        {
            return this.max;
        },
        /**
         * Set .max to .checkMax on features, augment ._count if key matches this.key, and hide/show self if we're below
         * the cap.
         *
         * @param key
         * @param features
         */
        checkCap : function( /* string */ key, /* Object[] */ features )
        {
            this.max = this.checkMax( features );
            if( key == this.key )
            {
                this._count++;
            }
            if( this._count >= this.max )
            {
                this.domNode.style.display = "none";
            }
            else
            {
                this.domNode.style.display = "list-item";
            }
        },
        /**
         * Enable addButton if we have an input value.
         *
         * @public void
         */
        checkAdd : function()
        {
            this.addButton.set( "disabled", !this.valueInput.get( "value" ) );
        },
        /**
         * Call manager.addFreeFeature with data read from UI controls here, then .clear() to make room for a new one.
         *
         * @public void
         */
        pleaseAddFeature : function()
        {
            this.manager.addFreeFeature({
                type : this.selector ? this.typeSelect.get( "value" ) : this.value,
                name : this.selector ? this.typeSelect.get( "displayedValue" ) : this.value,
                value : this.valueInput.get( "value" )
            }, this );
            this.clear();
        },
        /**
         * Clear typeSelect and valueInput, then .checkAdd.
         *
         * @public void
         */
        clear : function()
        {
            this.typeSelect.set( "value", this.typeSelect.options[ 0 ].value );
            this.valueInput.set( "value", "" );
            this.checkAdd();
        }
    });
});