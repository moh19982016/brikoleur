define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/dom-construct",
         "dojo/dom-geometry",
         "dojo/dom-class",
         "../../_base/_FeaturePaneBase",
         "../../_base/_NumberField",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          domConstruct,
          domGeometry,
          domClass,
          _FeaturePaneBase,
          _NumberField,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        title : i18n.Numbers,
        icon : "dashboard",
        threshold : 440,
        postCreate : function()
        {
            this.q1 = domConstruct.create( "div", { "class" : "br-formLayoutLeft" }, this.containerNode );
            this.q2 = domConstruct.create( "div", { "class" : "br-formLayoutRight" }, this.containerNode );
            domConstruct.create( "div", { "style" : "clear:both" }, this.containerNode );
            this.q3 = domConstruct.create( "div", { "class" : "br-formLayoutLeft" }, this.containerNode );
            this.q4 = domConstruct.create( "div", { "class" : "br-formLayoutRight" }, this.containerNode );
            domConstruct.create( "div", { "style" : "clear:both" }, this.containerNode );
            this.addField( "body", _NumberField, { title : i18n.Body, value : 6, onChange : lang.hitch( this, this._recalcStamina ), cost : 1 }, this.q1 );
            this.addField( "mind", _NumberField, { title : " + " + i18n.Mind, value : 6, onChange : lang.hitch( this, this._recalcStamina ), cost : 1  }, this.q2 );
            this.addField( "stamina", _NumberField, { title : " = " + i18n.Stamina, value : 12, disabled : true, "class" : "br-stamina" }, this.q2 );
            this.addField( "aps", _NumberField, { title : i18n.ActivePowerSlots, value : 2, cost : 4 }, this.q3 );
            this.addField( "os", _NumberField, { title : i18n.OhunSlots, value : 2, cost : 4 }, this.q4 );
            setTimeout( lang.hitch( this, this.resize ), 1 );
        },
        maximize : function()
        {
            this.inherited( arguments );
            this.resize();
        },
        resize : function()
        {
            if( domGeometry.getContentBox( this.containerNode ).w < this.threshold )
            {
                domClass.remove( this.q1, "br-formLayoutLeft" );
                domClass.remove( this.q2, "br-formLayoutRight" );
                domClass.remove( this.q3, "br-formLayoutLeft" );
                domClass.remove( this.q4, "br-formLayoutRight" );
            }
            else
            {
                domClass.add( this.q1, "br-formLayoutLeft" );
                domClass.add( this.q2, "br-formLayoutRight" );
                domClass.add( this.q3, "br-formLayoutLeft" );
                domClass.add( this.q4, "br-formLayoutRight" );
            }
        },
        _recalcStamina : function()
        {
            this.set( "stamina", ( this.get( "body" ) || 0 ) + ( this.get( "mind" ) || 0 ) );
        }
    });
});