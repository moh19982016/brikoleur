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
        pleaseRemoveControl : function( control )
        {
            this.inherited( arguments );
            topic.publish( "/StatChanged/-os", Controller.get( "os" ) );
        },
        listFeatures : function()
        {
            return []; // we don't want to filter ohun
        }
    });
});