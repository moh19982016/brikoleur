define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "./../../data/traits",
        "./../../_base/_FeaturePaneBase",
        "./../../_base/util",
        "./../_base/_ControlPaneMixin",
        "./../_base/_SubPaneMixin",
        "./_PowerSubPane",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          traits,
          _FeaturePaneBase,
          util,
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
        data : traits,
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/ActivePowerSet/", lang.hitch( this, this._checkActivePowers ) ) );
            this.own( topic.subscribe( "/StatChanged/-aps", lang.hitch( this, this._checkActivePowers ) ) );
            this.own( topic.subscribe( "/AddBonusPower/", lang.hitch( this, function( kwObj )
            {
                this.featureAdded({
                    key : kwObj.key,
                    value : kwObj.key,
                    data : kwObj.data
                });
            })));
        },
        _checkActivePowers : function()
        {
            console.log( "CAP!", this.controls, util.getProperties( this.controls, { property : "active", recurse : true, filter : false } ) );

            topic.publish( "/SetActiveControlDisabled/", util.getProperties( this.controls, { property : "active", recurse : true, filter : true } ).length >= Controller.get( "aps" ) );
        }
    });
});