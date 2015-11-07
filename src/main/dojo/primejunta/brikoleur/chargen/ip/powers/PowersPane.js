/**
 * Task resolver pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../oop/powers/PowersPane",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          PowersPane,
          i18n )
{
    return declare( [ PowersPane ],
    {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.Powers,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "bolt"
    } );
});