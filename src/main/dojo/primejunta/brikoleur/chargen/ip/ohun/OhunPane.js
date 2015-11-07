/**
 * Task resolver pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../oop/ohun/OhunPane",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          OhunPane,
          i18n )
{
    return declare( [ OhunPane ],
    {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.Ohun,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "star"
    } );
});