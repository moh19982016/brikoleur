/**
 * Control for knacks and training.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "../../data/knacks",
         "./../_base/_FeatureControl",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          knacks,
          _FeatureControl,
          i18n )
{
    var Constr = declare([ _FeatureControl ], {
        /**
         * Data for the feature.
         *
         * @public Object
         */
        data : knacks,
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedKnacks/",
        /**
         * Topic published when a feature of this type is added. Used to update state f.ex. if there are limits to the
         * number of controls we can add.
         *
         * @final
         * @public string
         */
        featureAddedTopic : "/TrainingAdded/",
        /**
         * Warning to display if trying add another item with the same name and type.
         *
         * @final
         * @public string
         */
        propertyPresentWarning : i18n.TrainingPresent,
        /**
         * Inherited, then setup recursive child creation by making .childConstructor point to Constr.
         *
         * @public void
         */
        postCreate : function()
        {
            this.inherited( arguments );
            this.childConstructor = Constr;
        },
        /**
         * Cost is 4 for everything over level 0 (which is the knack itself).
         *
         * @public int
         */
        getCost : function()
        {
            return this.level > 0 ? 4 : 0;
        }
    });
    return Constr;
});