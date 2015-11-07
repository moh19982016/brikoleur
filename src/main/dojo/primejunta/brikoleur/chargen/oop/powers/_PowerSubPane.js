/**
 * Sub-pane handling a particular type of Power.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "./../_base/_FeatureSubPane",
         "./_PowerControl" ],
function( declare,
          _FeatureSubPane,
          _PowerControl)
{
    return declare([ _FeatureSubPane ], {
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedPowers/",
        /**
         * Control used to assign and display the feature we're dealing with.
         *
         * @final
         * @public constructor
         */
        childConstructor : _PowerControl
    });
});