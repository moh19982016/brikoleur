define([ "dojo/_base/declare",
        "./../_base/_FeatureSubPane",
        "./_OhunControl" ],
function( declare,
          _FeatureSubPane,
          _OhunControl)
{
    return declare([ _FeatureSubPane ], {
        selectedFeaturesTopic : "/SelectedPowers/",
        featureControl : _OhunControl
    });
});