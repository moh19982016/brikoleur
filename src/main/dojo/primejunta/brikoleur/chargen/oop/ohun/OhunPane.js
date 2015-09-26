define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "./../../data/traits",
        "./../../_base/_FeaturePaneBase",
        "./../_base/_ControlPaneMixin",
        "./../_base/_SubPaneMixin",
        "./_OhunSubPane",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
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
        featureProperty : "ohun",
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/AddBonusOhun/", lang.hitch( this, function( kwObj )
            {
                this.featureAdded({
                    key : kwObj.key,
                    value : kwObj.key,
                    data : kwObj.data
                });
            })));
        }
    });
});