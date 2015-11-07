/**
 * Task resolver pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../oop/inventory/InventoryPane",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          InventoryPane,
          i18n )
{
    return declare( [ InventoryPane ],
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
        icon : "suitcase"
    } );
});