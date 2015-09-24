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
        selectedFeaturesTopic : "/SelectedPowers/",
        featureControl : _OhunControl,
        pleaseRemove : function( item )
        {
            this.inherited( arguments );
            topic.publish( "/StatChanged/-os", Controller.get( "os" ) );
        }
    });
});