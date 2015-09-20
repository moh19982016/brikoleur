define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/topic",
        "./_StuntControl",
        "./../_base/util",
        "../data/stunts",
        "../_base/_FeaturePaneBase",
         "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          lang,
          domClass,
          topic,
          _StuntControl,
          util,
          stunts,
          _FeaturePaneBase,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        title : i18n.Stunts,
        icon : "crosshairs",
        stuntsAllowed : 0,
        controls : [],
        postCreate : function()
        {
            this.own( topic.subscribe( "/TrainingAdded/", lang.hitch( this, this.checkStunt ) ) );
        },
        checkStunt : function( control )
        {
            if( control.type == "combat" )
            {
                this.stuntsAllowed++;
                this.enableAddStunt();
            }
        },
        enableAddStunt : function()
        {
            this.featureAdded();
        },
        featureAdded : function()
        {
            topic.publish( "/SelectedStunts/", util.getValues( this.controls ) );
            this.checkCreateControl();
            this.descendantFeatureAdded();
        },
        descendantFeatureAdded : function()
        {
            if( util.countItems( this.controls ) >= this.stuntsAllowed )
            {
                domClass.add( this.domNode, "br-maxPowers" );
            }
            else
            {
                domClass.remove( this.domNode, "br-maxPowers" );
                this.checkCreateControl();
            }
        },
        checkCreateControl : function()
        {
            if( !this._hasOpenStunt() )
            {
                this.controls.push( new _StuntControl({ parent : this } ).placeAt( this.containerNode ) );
            }
        },
        _hasOpenStunt : function()
        {
            for( var i = 0; i < this.controls.length; i++ )
            {
                if( !this.controls[ i ].complete )
                {
                    return true;
                }
            }
            return false;
        }
    });
});