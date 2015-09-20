define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "../_base/_FeaturePaneBase",
         "../_base/_NumberField",
         "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          lang,
          _FeaturePaneBase,
          _NumberField,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        title : i18n.Numbers,
        icon : "calculator",
        postCreate : function()
        {
            this.addField( "body", new _NumberField({ title : i18n.Body, value : 6, onChange : lang.hitch( this, this._recalcStamina ), cost : 1 } ) );
            this.addField( "mind", new _NumberField({ title : i18n.Mind, value : 6, onChange : lang.hitch( this, this._recalcStamina ), cost : 1  } ) );
            this.addField( "stamina", new _NumberField({ title : i18n.Stamina, value : 12, readonly : true } ) );
            this.addField( "armour", new _NumberField({ title : i18n.Armour, value : 0 } ) );
            this.addField( "aps", new _NumberField({ title : i18n.ActivePowerSlots, value : 2, cost : 4 } ) );
            this.addField( "os", new _NumberField({ title : i18n.OhunSlots, value : 2, cost : 4 } ) );
        },
        _recalcStamina : function()
        {
            this.set( "stamina", ( this.get( "body" ) || 0 ) + ( this.get( "mind" ) || 0 ) );
        }
    });
});