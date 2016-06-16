/**
 * Numbers pane. Extends one from out-of-play with in-play features that spend points from the stats.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dojo/dom-class",
          "./../../_base/fx",
          "./../../oop/numbers/NumbersPane" ],
function( declare,
          lang,
          topic,
          domClass,
          fx,
          NumbersPane )
{
    return declare( [ NumbersPane ],
    {
        /**
         * Inherited, then subscribe to /PointsSpent/ and /DamageTaken/ topics.
         *
         * @public void
         */
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/PointsSpent/", lang.hitch( this, this._spendPoints ) ) );
            this.own( topic.subscribe( "/DamageTaken/", lang.hitch( this, this._takeDamage ) ) );
        },
        /**
         * Set, only with a visual FX.
         *
         * @param stat
         * @param val
         */
        fxSet : function( stat, val )
        {
            this.set( stat, val );
            fx.flash( this._props[ stat ]._input.domNode, "br-valueChanged" );
        },
        /**
         * Subtract points from stat and mark stat as changed.
         * 
         * @param stat
         * @param points
         * @private void
         */
        _spendPoints : function( stat, points )
        {
            if( this.get( stat ) - points < 0 )
            {
                return;
            }
            if( points > 0 )
            {
                domClass.add( this._props[ stat ]._input.domNode, "br-valueHasChanged" );
            }
            this.fxSet( stat, this.get( stat ) - points );
            if( ( stat == "mind" || stat == "body" ) && !Controller.inPlayPane.inCombat )
            {
                fx.flash( this._props.stamina._input.domNode, "br-valueChanged" );
            }
        },
        /**
         * Subtract points from stamina. If it hits zero, subtract remainder from body. If stamina <= 0, mark self as
         * wounded; if body <= 0, mark self as incapacitated; if body <= -maxBody, mark self as dead.
         *
         * @param points
         * @private void
         */
        _takeDamage : function( /* int */ points )
        {
            var rem = points - this.get( "stamina" );
            if( points > 0 )
            {
                this.fxSet( "stamina", Math.max( 0, this.get( "stamina" ) - points ) );
                domClass.add( this._props.stamina._input.domNode, "br-valueHasChanged" );
            }
            if( rem > 0 )
            {
                this.fxSet( "body", this.get( "body" ) - rem );
                domClass.add( this._props.body._input.domNode, "br-valueHasChanged" );
            }
            if( this.get( "stamina" ) <= 0 )
            {
                this._setCharacterStatus( "wounded" );
            }
            if( this.get( "body") <= 0 )
            {
                this._setCharacterStatus( "incapacitated" );
            }
            if( this.get( "body" ) <= -Controller.characterPane.panes.numbers.get( "body" ) )
            {
                this._setCharacterStatus( "dead" );
            }
        },
        /**
         * If we're not .inCombat, inherited. We don't want to recalc stamina while combat is ongoing...
         * 
         * @private void
         */
        _recalcStamina : function()
        {
            if( !Controller.inPlayPane.inCombat )
            {
                this.inherited( arguments );
                domClass.remove( this._props.stamina._input.domNode, "br-valueHasChanged" );
            }
        },
        /**
         * Add a domClass to Controller.inPlayPane matching character status.
         * 
         * @param status
         * @private void
         */
        _setCharacterStatus : function( status )
        {
            Controller.inPlayPane.characterStatus = status;
            domClass.replace( Controller.inPlayPane.domNode, "br-status-" + status, "br-status-wounded br-status-incapacitated br-status-dead" );
        }
    } );
} );