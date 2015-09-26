define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../_base/_FeaturePaneBase",
         "./../_base/_ControlPaneMixin",
         "./_KnackControl",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          _FeaturePaneBase,
          _ControlPaneMixin,
          _KnackControl,
          i18n )
{
    return declare([ _FeaturePaneBase, _ControlPaneMixin ],
    {
        title : i18n.KnacksAndTraining,
        featureName : i18n.Knacks,
        icon : "mortar-board",
        allowedControls : 3,
        featureControl : _KnackControl,
        selectedFeaturesTopic : "/SelectedKnacks/",
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/AddBonusKnack/", lang.hitch( this, this._addBonusKnack ) ) );
        },
        _addBonusKnack : function( knack )
        {
            this.allowedControls++;
            if( knack )
            {
                var ctl = this.addControl( {}, "first" );
                ctl.set( "state", {
                    key : knack,
                    value : knack
                });
                ctl.addChildControl();
            }
        }
    });
});