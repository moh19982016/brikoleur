/**
 * Mixin for powered abilities -- Powers and Stunts. Calculates the use cost of the ability based on its level, and
 * displays the full info in .valueNode.
 *
 * @public Mixin
 */
define([ "dojo/_base/declare",
        "./util" ],
function( declare,
          util )
{
    return declare([], {
        /**
         * Call _printValue to display the item with its cost, and parent.onCompleteChild if available (which will
         * update the info on it.)
         *
         * @public void
         */
        onCompleteChild : function()
        {
            this._printValue();
            if( this.parent.onCompleteChild )
            {
                this.parent.onCompleteChild( true );
            }
        },
        /**
         * Calculates use cost on level and ._getDiscount(). Passive abilities have a cost of 0.
         *
         * @private int
         */
        _getUseCost : function()
        {
            if( this.state.type == "passive" )
            {
                return 0;
            }
            return Math.max( 0, this.level + 1 - this._getDiscount() );
        },
        /**
         * Calculates discount based on how many generations of children the ability has. Each generation lowers the
         * cost by 1.
         *
         * @private int
         */
        _getDiscount : function()
        {
            var disc = 0;
            if( util.getProperties( this.controls, { property : "complete", filter : true } ).length > 0 )
            {
                disc++;
                var cdiscs = [];
                for( var i = 0; i < this.controls.length; i++ )
                {
                    cdiscs.push( this.controls[ i ]._getDiscount() );
                }
                disc += Math.max.apply( this, cdiscs );
            }
            return disc;
        },
        /**
         * Inherited, then ._printValue().
         *
         * @private void
         */
        _setValue : function()
        {
            this.inherited( arguments );
            this._printValue();
        },
        /**
         * Displays ability name with marker for associated stat, cost to use, and possible extra cost if allowed.
         *
         * @private void
         */
        _printValue : function()
        {
            this.valueNode.innerHTML = this.statName + ":" + this._getUseCost() + ( this.state.extra_cost ? "+" + this.state.extra_cost : "" ) + "/" + this.state.value;
        }
    });
});