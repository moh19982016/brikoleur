/**
 * Task resolver pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../oop/stunts/StuntsPane",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          StuntsPane,
          i18n )
{
    return declare( [ StuntsPane ],
    {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.Stunts,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "crosshairs"
    } );
});