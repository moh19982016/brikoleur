define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "../../data/knacks",
        "./../_base/_FeatureControlBase",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          knacks,
          _FeatureControlBase,
          i18n )
{
    var Constr = declare([ _FeatureControlBase ], {
        data : knacks,
        selectedFeaturesTopic : "/SelectedKnacks/",
        addFeatureTopic : "/TrainingAdded/",
        propertyPresentWarning : i18n.TrainingPresent,
        postCreate : function()
        {
            this.inherited( arguments );
            this.childConstructor = Constr;
        },
        getCost : function()
        {
            return this.level > 0 ? 4 : 0;
        }
    });
    return Constr;
});