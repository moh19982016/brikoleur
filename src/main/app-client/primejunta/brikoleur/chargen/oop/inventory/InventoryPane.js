/**
 * Inventory pane.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/dom-construct",
          "./_ItemControl",
          "./_WeaponControl",
          "./_ArmourControl",
          "./_ItemHeader",
          "./_AddItemControl",
          "./../../_base/_FeaturePaneBase",
          "dijit/_WidgetsInTemplateMixin",
          "dojo/text!./templates/InventoryPane.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          domConstruct,
          _ItemControl,
          _WeaponControl,
          _ArmourControl,
          _ItemHeader,
          _AddItemControl,
          _FeaturePaneBase,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare( [ _FeaturePaneBase, _WidgetsInTemplateMixin ],
    {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.Gear,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "suitcase",
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Create button spacer in domNode, then a Button to add new inventory items, then an ItemHeader for the
         * inventory. Then ._addItem once so we have something to start with.
         *
         * @public void
         */
        postCreate : function()
        {
            domConstruct.create( "div", { "class" : "br-buttonSpacer" }, this.domNode, "last" );
            this.addItemControl =
            new _AddItemControl( { manager : this } ).placeAt( this.containerNode );
            this.own( this.addItemControl );
        },
        /**
         * Calls .addField "item" with _ItemControl at .addItemControl node. The argumnet is passed to the constructor.
         *
         * @param props
         * @private void
         */
        addItem : function( /* Object */ props )
        {
            props.value = props.value || {};
            props.parent = this;
            switch( props.value.type )
            {
                case "weapon" :
                    this.addField( "item", _WeaponControl,  props, this.weaponsNode );
                    break;
                case "armour" :
                    this.addField( "item", _ArmourControl,  props, this.armoursNode );
                    break;
                default :
                    this.addField( "item", _ItemControl,  props, this.itemsNode );
            }
        },
        /**
         * Clear, then iterate through state and ._addItem for each member.
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object[] */ state )
        {
            this.clear();
            for( var i = 0; i < state.length; i ++ )
            {
                if( state[ i ] )
                {
                    this.addItem( { value : state[ i ].value, prefilled : true } )
                }
            }
        }
    } );
} );