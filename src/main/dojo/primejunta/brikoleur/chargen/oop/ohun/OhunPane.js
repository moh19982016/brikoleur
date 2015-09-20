define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "./../../data/traits",
        "./../../_base/util",
        "./../../_base/_FeaturePaneBase",
        "./../_base/_ControlPaneMixin",
        "./../_base/FilteringMemory",
        "./_OhunSubPane",
        "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
      lang,
      topic,
      traits,
      util,
      _FeaturePaneBase,
      _ControlPaneMixin,
      FilteringMemory,
          _OhunSubPane,
      i18n )
{
    return declare([ _FeaturePaneBase, _ControlPaneMixin ],
    {
        title : i18n.Ohun,
        icon : "star",
        allowedControls : -1,
        featureControl : _OhunSubPane,
        selectedFeaturesTopic : "/SelectedOhun/",
        featureProperty : "ohun",
        postCreate : function()
        {
            this.controls = [];
            this._store = new FilteringMemory({ data : util.listToStoreData( traits.list ) });
            topic.subscribe( "/SelectedTraits/", lang.hitch( this, this.setupSubPanes ) );
        }
    });
});