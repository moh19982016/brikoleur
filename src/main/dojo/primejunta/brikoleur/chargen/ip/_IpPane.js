define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "../_base/_MainPaneBase",
          "./name/NamePane",
          "./resolver/ResolverPane",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          _MainPaneBase,
          NamePane,
          ResolverPane,
          i18n )
{
    return declare( [ _MainPaneBase ], {
        title : i18n.InPlay,
        /**
         * Adds all the UI panes needed for the character creator.
         *
         * @private void
         */
        setupPanes : function()
        {
            this._addPane( "name", new NamePane().placeAt( this.nameContainer ) );
            this._addPane( "resolver", new ResolverPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
        }
    } );
} );