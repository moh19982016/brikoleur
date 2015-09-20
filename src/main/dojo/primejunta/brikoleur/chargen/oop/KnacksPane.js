define([ "dojo/_base/declare",
         "./../_FeaturePaneBase",
        "./_base/_ControlPaneMixin",
         "./_KnackControl",
         "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          _FeaturePaneBase,
          _ControlPaneMixin,
          _KnackControl,
          i18n )
{
    return declare([ _FeaturePaneBase, _ControlPaneMixin ],
    {
        title : i18n.Knacks,
        icon : "gift",
        allowedControls : 3,
        featureControl : _KnackControl,
        selectedFeaturesTopic : "/SelectedKnacks/"
    });
});