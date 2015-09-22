define([ "dojo/_base/declare",
         "./../../_base/_FeaturePaneBase",
         "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare, _FeaturePaneBase, i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        title : i18n.Description,
        icon : "user"
    });
});