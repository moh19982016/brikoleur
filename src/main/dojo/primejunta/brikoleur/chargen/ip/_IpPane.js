define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "../_base/_MainPaneBase",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          _MainPaneBase,
          i18n )
{
    return declare( [ _MainPaneBase ], {
        title : i18n.InPlay,
        /**
         * Adds all the UI panes needed for the character creator.
         *
         * @private void
         */
        _setupPanes : function()
        {
        }
    } );
} );