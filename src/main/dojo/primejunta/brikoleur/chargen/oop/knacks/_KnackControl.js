/**
 * Control for knacks and training.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/dom-class",
         "../../data/knacks",
         "./../_base/_FeatureControlBase",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          domClass,
          knacks,
          _FeatureControlBase,
          i18n )
{
    return declare([ _FeatureControlBase ], {
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
        featureRemovedTopic : "/TrainingRemoved/",
        /**
         * Warning to display if trying add another item with the same name and type.
         *
         * @final
         * @public string
         */
        propertyPresentWarning : i18n.TrainingPresent,
        postCreate : function()
        {
            this.inherited( arguments );
            if( this.level == 0 )
            {
                domClass.add( this.removeButton.domNode, "br-hideForOld" );
            }
        },
        /**
         * Cost is 4 for everything over level 0 (which is the knack itself).
         *
         * @public int
         */
        getCost : function()
        {
            return Math.max( 0, ( this.level > 0 ? 4 : 0 ) - ( Controller.discounts.training || 0 ) );
        },
        /**
         * Adds (K), (T), or (S) prefix to val, by level.
         *
         * @param val
         * @private string
         */
        _formatValue : function( /* string */ val )
        {
            switch( this.level )
            {
                case 0 :
                    return 'Ⓚ ' + val;
                case 1 :
                    return 'Ⓣ ' + val;
                case 2 :
                    return 'Ⓢ ' + val;
                default :
                    return val;
            }
        }
    });
});