define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "./_base/_FeatureControlBase",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          _FeatureControlBase,
          i18n )
{
    return declare([ _FeatureControlBase ], {
        data : {},
        selectedFeaturesTopic : "/SelectedOhun/",
        featureAddedTopic : "/OhunAdded/",
        propertyPresentWarning : i18n.PowerPresent
    });
});