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
        selectedFeaturesTopic : "/SelectedOhun/",
        featureControl : _OhunControl,
        pleaseRemove : function( item )
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