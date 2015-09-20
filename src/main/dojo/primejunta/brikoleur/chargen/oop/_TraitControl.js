define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "../data/traits",
        "./_base/_FeatureControlBase",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          traits,
          _FeatureControlBase,
          i18n )
{
    return declare([ _FeatureControlBase ], {
        data : traits,
        selectedFeaturesTopic : "/SelectedTraits/",
        featureAddedTopic : "/TraitAdded/",
        propertyPresentWarning : i18n.TraitPresent,
        closed : true
    });
});