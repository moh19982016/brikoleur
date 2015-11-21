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
            this.own( topic.subscribe( "/DamageTaken/", lang.hitch( this, this._takeDamage ) ) );
        },
        fxSet : function( stat, val )
        {
            this.set( stat, val );
            fx.flash( this._props[ stat ]._input.domNode, "br-valueChanged" );
        },
        _takeDamage : function( points )
        {
            var rem = points - this.get( "stamina" );
            this.set( "stamina", Math.max( 0, this.get( "stamina" ) - points ) );
            if( rem > 0 )
            {
                this.set( "body", this.get( "body" ) - rem );
            }
            if( this.get( "stamina" ) <= 0 )
            {
                this._setStatus( "wounded" );
            }
            if( this.get( "body") <= 0 )
            {
                this._setStatus( "incapacitated" );
            }
            if( this.get( "body" ) <= -Controller.characterPane.panes.numbers.get( "body" ) )
            {
                this._setStatus( "dead" );
            }
        },
        _spendPoints : function( stat, points )
        {
            if( this.get( stat ) - points < 0 )
            {
                return;
            }
            if( points > 0 )
            {
                domClass.add( this._props[ stat ]._input.domNode, "br-valueChanged" );
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
        },
        _setStatus : function( status )
        {
            domClass.replace( Controller.inPlayPane.domNode, "br-status-" + status, "br-status-wounded br-status-incapacitated br-status-dead" );
        }
    } );
} );