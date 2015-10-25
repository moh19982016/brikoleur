define( [ "dojo/_base/declare",
          "dojo/_base/lang",
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
        /**
         * Adds all the UI panes needed for in-play mode.
         *
         * @private void
         */
        setupPanes : function()
        {
            this._addPane( "name", new NamePane().placeAt( this.nameContainer ) );
            this._addPane( "resolver", new ResolverPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "numbers", new NumbersPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "powers", new PowersPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "ohun", new OhunPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "stunts", new StuntsPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "gear", new InventoryPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
        }
    } );
} );