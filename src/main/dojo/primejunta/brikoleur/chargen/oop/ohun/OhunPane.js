define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "./../../data/traits",
        "./../../_base/_FeaturePaneBase",
        "./../_base/_ControlPaneMixin",
        "./../_base/_SubPaneMixin",
        "./_OhunSubPane",
        "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
      lang,
      traits,
      _FeaturePaneBase,
      _ControlPaneMixin,
      _SubPaneMixin,
      _OhunSubPane,
      i18n )
{
    return declare([ _FeaturePaneBase, _ControlPaneMixin, _SubPaneMixin ],
    {
        title : i18n.Ohun,
        icon : "star",
        allowedControls : -1,
        data : traits,
        featureControl : _OhunSubPane,
        selectedFeaturesTopic : "/SelectedOhun/",
        selectedMasterItemTopic : "/SelectedTraits/",
        featureProperty : "ohun"
    });
});