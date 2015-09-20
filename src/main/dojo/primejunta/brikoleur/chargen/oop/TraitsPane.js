define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
         "./../_FeaturePaneBase",
         "./_TraitControl",
         "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          lang,
          topic,
          _FeaturePaneBase,
          _TraitControl,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        title : i18n.Traits,
        icon : "magic",
        postCreate : function()
        {
            this.addField( "trait_1", new _TraitControl() );
            this.addField( "trait_2", new _TraitControl() );
            this.own( topic.subscribe( "/TraitSelected/", lang.hitch( this, this.onSelectTrait ) ) );
        },
        onSelectTrait : function()
        {
            topic.publish( "/SelectedTraits/", [ this.get( "trait_1" ), this.get( "trait_2" ) ]);
        }
    });
});