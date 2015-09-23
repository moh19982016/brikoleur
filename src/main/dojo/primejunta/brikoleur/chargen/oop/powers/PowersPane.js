define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "./../../data/traits",
        "./../../_base/_FeaturePaneBase",
        "./../_base/_ControlPaneMixin",
        "./../_base/_SubPaneMixin",
        "./_PowerSubPane",
        "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          lang,
          traits,
          _FeaturePaneBase,
          _ControlPaneMixin,
          _SubPaneMixin,
          _PowerSubPane,
          i18n )
{
    return declare([ _FeaturePaneBase, _ControlPaneMixin, _SubPaneMixin ],
    {
        title : i18n.Powers,
        icon : "bolt",
        allowedControls : -1,
        featureControl : _PowerSubPane,
        selectedFeaturesTopic : "/SelectedPowers/",
        selectedMasterItemTopic : "/SelectedTraits/",
        featureProperty : "powers",
        data : traits
    });
});