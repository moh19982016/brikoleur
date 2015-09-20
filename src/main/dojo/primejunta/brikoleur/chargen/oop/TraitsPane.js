define([ "dojo/_base/declare",
        "./../_base/_FeaturePaneBase",
        "./_base/_ControlPaneMixin",
        "./_TraitControl",
        "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          _FeaturePaneBase,
          _ControlPaneMixin,
          _TraitControl,
          i18n )
{
    return declare([ _FeaturePaneBase, _ControlPaneMixin ],
    {
        title : i18n.Traits,
        icon : "magic",
        allowedControls : 2,
        featureControl : _TraitControl,
        selectedFeaturesTopic : "/SelectedTraits/"
    });
});