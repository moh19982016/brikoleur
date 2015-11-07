/**
 * Task resolver pane.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dojo/dom-class",
          "./../../_base/fx",
          "./../../oop/numbers/NumbersPane",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          domClass,
          fx,
          NumbersPane,
          i18n )
{
    return declare( [ NumbersPane ],
    {
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/PointsSpent/", lang.hitch( this, this._spendPoints ) ) );
        },
        fxSet : function( stat, val )
        {
            this.set( stat, val );
            fx.flash( this._props[ stat ]._input.domNode, "br-valueChanged" );
        },
        _spendPoints : function( stat, points )
        {
            if( this.get( stat ) - points < 0 )
            {
                return;
            }
            if( points > 0 )
            {
                domClass.add( this._props[ stat ]._input.domNode, "br-valueLowered" );
            }
            this.fxSet( stat, this.get( stat ) - points );
            if( ( stat == "mind" || stat == "body" ) && !Controller.inPlayPane.inCombat )
            {
                fx.flash( this._props.stamina._input.domNode, "br-valueChanged" );
            }
        },
        _recalcStamina : function()
        {
            if( !Controller.inPlayPane.inCombat )
            {
                this.inherited( arguments );
            }
        }
    } );
} );