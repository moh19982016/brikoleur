define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/topic",
        "./_PowerControl",
        "../data/stunts",
        "../_FeaturePaneBase",
         "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          lang,
          domClass,
          topic,
          _PowerControl,
          stunts,
          _FeaturePaneBase,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        title : i18n.Stunts,
        icon : "crosshairs",
        postCreate : function()
        {
            this.own( topic.subscribe( "/CombatTrainingAdded/", lang.hitch( this, this._allowStunt ) ) );
            this.own( topic.subscribe( "/StuntAdded/", lang.hitch( this, this._disAllowStunt ) ) );
        },
        _allowStunt  : function( knack )
        {
            this.own( new _PowerControl({ manager : this, link : knack } ).placeAt( this.containerNode ) );
            domClass.replace( this.domNode, "br-powersAllowed", "br-powersNotAllowed" );
        },
        _disAllowStunt : function( stunt )
        {
            domClass.replace( this.domNode, "br-powersNotAllowed", "br-powersAllowed" );
        }
    });
});