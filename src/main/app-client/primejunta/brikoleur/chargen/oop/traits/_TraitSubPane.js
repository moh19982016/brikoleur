/**
 * Sub-pane handling a Trait or a Twist.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "./../_base/_FeatureSubPane",
         "./_TraitControl" ],
function( declare,
          _FeatureSubPane,
          _TraitControl)
{
    return declare([ _FeatureSubPane ], {
        _allowedControls : 1,
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedTraits/",
        /**
         * Control used to assign and display the feature we're dealing with.
         *
         * @final
         * @public constructor
         */
        childConstructor : _TraitControl
    });
});