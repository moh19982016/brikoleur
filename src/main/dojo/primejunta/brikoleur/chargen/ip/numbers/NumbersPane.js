/**
 * Task resolver pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../_base/_FeaturePaneBase",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          _FeaturePaneBase,
          i18n )
{
    return declare( [ _FeaturePaneBase ],
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
});