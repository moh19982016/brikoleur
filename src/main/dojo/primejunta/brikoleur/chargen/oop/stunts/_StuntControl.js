/**
 * Control for managing Stunts.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "../../data/stunts",
         "./../_base/_FeatureControlBase",
         "./../_base/_PoweredAbilityMixin",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          stunts,
          _FeatureControlBase,
          _PoweredAbilityMixin,
          i18n )
{
    return declare([ _FeatureControlBase, _PoweredAbilityMixin ], {
        /**
         * Data for the feature.
         *
         * @public Object
         */
        data : stunts,
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedStunts/",
        /**
         * Topic published when a feature of this type is added. Used to update state f.ex. if there are limits to the
         * number of controls we can add.
         *
         * @final
         * @public string
         */
        featureAddedTopic : "/StuntAdded/",
        /**
         * Warning to display if trying add another item with the same name and type.
         *
         * @final
         * @public string
         */
        propertyPresentWarning : i18n.StuntPresent,
        /**
         * Identifier of stat powering the feature -- for stunts, Body.
         *
         * @final
         * @public string
         */
        statName : "Ⓑ"
    });
});