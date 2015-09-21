define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "./../_base/_FeatureControlBase",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          _FeatureControlBase,
          i18n )
{
    return declare([ _FeatureControlBase ], {
        data : {},
        selectedFeaturesTopic : "/SelectedPowers/",
        featureAddedTopic : "/PowerAdded/",
        propertyPresentWarning : i18n.PowerPresent,
        maxLevel : 3,
        childProperties : {
            getCost : function()
            {
                return this.level + 2;
            }
        },
        getCost : function()
        {
            return this.level + 2;
        }
    });
});