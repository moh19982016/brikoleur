/**
 * Out of play pane. This contains the main character creation functionality.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "../_base/_MainPaneBase",
          "./name/NamePane",
          "./description/DescriptionPane",
          "./inventory/InventoryPane",
          "./knacks/KnacksPane",
          "./numbers/NumbersPane",
          "./traits/TraitsPane",
          "./powers/PowersPane",
          "./stunts/StuntsPane",
          "./ohun/OhunPane",
          "./../_base/util",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          _MainPaneBase,
          NamePane,
          DescriptionPane,
          InventoryPane,
          KnacksPane,
          NumbersPane,
          TraitsPane,
          PowersPane,
          StuntsPane,
          OhunPane,
          util,
          i18n )
{
    return declare( [ _MainPaneBase ], {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.OutOfPlay,
        /**
         * Bootstrap the character creation panes.
         *
         * @public void
         */
        setupPanes : function()
        {
            this._addPane( "character_name", new NamePane().placeAt( this.nameContainer ) );
            this._addPane( "traits", new TraitsPane( { dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "knacks", new KnacksPane( { minimized : true, manualMaximizeOnly : true, dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "numbers", new NumbersPane( { minimized : true, dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "powers",
                           new PowersPane( { minimized : true, dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "stunts",
                           new StuntsPane( { minimized : true, dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "ohun", new OhunPane( { minimized : true, manualMaximizeOnly : true, dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "gear", new InventoryPane( { minimized : true, dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
            this._addPane( "description",
                           new DescriptionPane( { minimized : true, dock : this.dockContainer } ).placeAt( this.dynamicGrid ) );
        },
        /**
         * Since the number of allowed stunts depends on the number of combat training slots the character has used,
         * we need to go through the Controller to determine that. The StuntsPane uses this method.
         *
         * @public int
         */
        getAllowedStunts : function()
        {
            var n = 0;
            var controls = this.panes.knacks.controls;
            for( var i = 0; i < controls.length; i++ )
            {
                if( controls[ i ].get( "state" ).type == "combat" )
                {
                    n += util.countCompleteControls( controls[ i ].controls );
                }
            }
            return n;
        }
    } );
} );