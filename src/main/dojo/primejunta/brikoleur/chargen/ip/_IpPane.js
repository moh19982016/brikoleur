define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/dom-class",
          "../_base/_MainPaneBase",
          "./name/NamePane",
          "./resolver/ResolverPane",
          "./inventory/InventoryPane",
          "./numbers/NumbersPane",
          "./powers/PowersPane",
          "./stunts/StuntsPane",
          "./ohun/OhunPane",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          domClass,
          _MainPaneBase,
          NamePane,
          ResolverPane,
          InventoryPane,
          NumbersPane,
          PowersPane,
          StuntsPane,
          OhunPane,
          i18n )
{
    return declare( [ _MainPaneBase ], {
        title : i18n.InPlay,
        _inCombat : false,
        /**
         * Adds all the UI panes needed for in-play mode.
         *
         * @private void
         */
        setupPanes : function()
        {
            domClass.add( this.domNode, "br-outOfCombat" );
            this._addPane( "name", new NamePane( { manager : this } ).placeAt( this.nameContainer ) );
            this._addPane( "knacks", new ResolverPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "numbers", new NumbersPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "powers", new PowersPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "ohun", new OhunPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "stunts", new StuntsPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "gear", new InventoryPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
        },
        toggleCombat : function( button )
        {
            this._inCombat = !this._inCombat;
            if( this._inCombat )
            {
                button.set( "label", i18n.ExitCombat );
                button.set( "iconClass", "fa fa-pagelines" );
                domClass.replace( this.domNode, "br-inCombat", "br-outOfCombat" );
            }
            else
            {
                button.set( "label", i18n.StartCombat );
                button.set( "iconClass", "br-icon br-icon-combat" );
                domClass.replace( this.domNode, "br-outOfCombat", "br-inCombat" );
            }
        }
    } );
} );