define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../_FeaturePaneBase",
         "./_KnackControl",
         "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          lang,
          topic,
          _FeaturePaneBase,
          _KnackControl,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        title : i18n.Knacks,
        icon : "gift",
        postCreate : function()
        {
            this.addField( "knack_1", new _KnackControl({ manager : this }) );
            this.addField( "knack_2", new _KnackControl({ manager : this }) );
            this.addField( "knack_3", new _KnackControl({ manager : this }) );
            this.own( topic.subscribe( "/KnackSelected/", lang.hitch( this, this.onSelectKnack ) ) );
        },
        onSelectKnack : function()
        {
            topic.publish( "/SelectedKnacks/", [ this.get( "knack_1" ), this.get( "knack_2" ), this.get( "knack_3" ) ]);
        }
    });
});