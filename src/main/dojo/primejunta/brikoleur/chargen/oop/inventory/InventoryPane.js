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
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          domConstruct,
          _ItemControl,
          _WeaponControl,
          _ArmourControl,
          _ItemHeader,
          _AddItemControl,
          _FeaturePaneBase, i18n )
{
    return declare( [ _FeaturePaneBase ],
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
            this.own( this.addItemControl, new _ItemHeader().placeAt( this.addItemControl.domNode, "before" ) );
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
            this.addField( "item",
                           props.value.type == "weapon" ? _WeaponControl : props.value.type == "armour" ? _ArmourControl : _ItemControl,
                           lang.mixin( props || {}, { parent : this } ),
                           this.addItemControl.domNode,
                           "before" );
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