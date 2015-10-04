define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "../../data/stunts",
        "./../_base/_FeatureControlBase",
        "./../_base/_PoweredAbilityMixin",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          stunts,
          _FeatureControlBase,
          _PoweredAbilityMixin,
          i18n )
{
    var Constr = declare([ _FeatureControlBase, _PoweredAbilityMixin ], {
        data : stunts,
        selectedFeaturesTopic : "/SelectedStunts/",
        addFeatureTopic : "/StuntAdded/",
        propertyPresentWarning : i18n.StuntPresent,
        statName : "B",
        postCreate : function()
        {
            this.inherited( arguments );
            this.childConstructor = Constr;
        }
    });
    return Constr;
});