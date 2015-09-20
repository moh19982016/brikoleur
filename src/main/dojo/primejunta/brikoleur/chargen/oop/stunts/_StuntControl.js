define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "../../data/stunts",
        "./../_base/_FeatureControlBase",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          stunts,
          _FeatureControlBase,
          i18n )
{
    return declare([ _FeatureControlBase ], {
        data : stunts,
        selectedFeaturesTopic : "/SelectedStunts/",
        featureAddedTopic : "/StuntAdded/",
        propertyPresentWarning : i18n.StuntPresent
    });
});