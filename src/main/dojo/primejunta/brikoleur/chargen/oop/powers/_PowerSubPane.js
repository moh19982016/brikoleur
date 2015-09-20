define([ "dojo/_base/declare",
        "./../_base/_FeatureSubPane",
        "./_PowerControl" ],
function( declare,
          _FeatureSubPane,
          _PowerControl)
{
    return declare([ _FeatureSubPane ], {
        selectedFeaturesTopic : "/SelectedPowers/",
        featureControl : _PowerControl
    });
});