/**
 * Task resolver pane.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "./../../oop/numbers/NumbersPane",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          NumbersPane,
          i18n )
{
    return declare( [ NumbersPane ],
    {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.Numbers,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "dashboard"
    } );
} );