/**
 * Inventory pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dojo/dom-construct",
         "dijit/form/Button",
         "./_ItemControl",
         "./_ItemHeader",
         "./../../_base/_FeaturePaneBase",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          domConstruct,
          Button,
          _ItemControl,
          _ItemHeader,
          _FeaturePaneBase, i18n )
{
    return declare([ _FeaturePaneBase ],
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
            this.addItemControl = new Button({ label : "<i class='fa fa-plus-square br-blue'></i>", onClick : lang.hitch( this, this._addItem ), "class" : "br-wideAddButton" } ).placeAt( this.containerNode );
            this.own( this.addItemControl, new _ItemHeader().placeAt( this.addItemControl.domNode, "before" ) );
            this._addItem();
        },
        /**
         * Inherited, then ._checkRemove().
         *
         * @public void
         */
        pleaseRemoveControl : function()
        {
            this.inherited( arguments );
            this._checkRemove();
        },
        /**
         * Calls .addField "item" with _ItemControl at .addItemControl node. The argumnet is passed to the constructor.
         *
         * @param props
         * @private void
         */
        _addItem : function( /* Object */ props )
        {
            this.addField( "item", _ItemControl, lang.mixin( props || {}, { parent : this } ), this.addItemControl.domNode, "before" );
            this._checkRemove();
        },
        /**
         * Publishes topic to enable/disable remove button. It's disabled if there's only one item in the inventory.
         *
         * @private void
         */
        _checkRemove : function()
        {
            topic.publish( "/SetGearRemoveLock/", this.controls.length <= 1 );
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
            for( var i = 0; i < state.length; i++ )
            {
                if( state[ i ] )
                {
                    this._addItem({ value : state[ i ].value })
                }
            }
        }
    });
});