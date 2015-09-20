define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../_FeaturePaneBase",
         "./_KnackControl",
        "./_base/util",
         "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          lang,
          topic,
          _FeaturePaneBase,
          _KnackControl,
          util,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        title : i18n.Knacks,
        icon : "gift",
        allowedKnacks : 3,
        postCreate : function()
        {
            this.controls = [];
            this.featureAdded();
        },
        featureAdded : function()
        {
            if( this.controls.length < this.allowedKnacks )
            {
                this.controls.push( new _KnackControl( { parent : this } ).placeAt( this.containerNode ) );
            }
            topic.publish( "/SelectedKnacks/", util.getValues( this.controls ) );
        }
    });
});