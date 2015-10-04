/**
 * Sub-pane for a particular type of ohun.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/topic",
         "./../_base/_FeatureSubPane",
         "./_OhunControl" ],
function( declare,
          topic,
          _FeatureSubPane,
          _OhunControl)
{
    return declare([ _FeatureSubPane ], {
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedOhun/",
        /**
         * Control used to assign and display the feature we're dealing with.
         *
         * @final
         * @public constructor
         */
        featureControl : _OhunControl,
        /**
         * Inherited, then publish topic indicating ohun slots have changed (=been freed up).
         *
         * @param control
         * @public void
         */
        pleaseRemoveControl : function( /* _OhunControl */ control )
        {
            this.inherited( arguments );
            topic.publish( "/StatChanged/-os", Controller.get( "os" ) );
        },
        /**
         * Return an empty array, since we're not filtering ohun, unlike most similar features.
         *
         * @public Array
         */
        listFeatures : function()
        {
            return [];
        }
    });
});