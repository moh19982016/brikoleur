define([ "dojo/_base/declare",
        "./../../_base/util" ],
function( declare,
          util )
{
    return declare([], {
        onCompleteChild : function()
        {
            this._printValue();
            if( this.parent.onCompleteChild )
            {
                this.parent.onCompleteChild( true );
            }
        },
        _getUseCost : function()
        {
            if( this.state.type == "passive" )
            {
                return 0;
            }
            return Math.max( 0, this.level + 1 - this._getDiscount() );
        },
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
        _setValue : function()
        {
            this.inherited( arguments );
            this._printValue();
        },
        _printValue : function()
        {
            this.valueNode.innerHTML = this.statName + ":" + this._getUseCost() + ( this.state.extra_cost ? "+" + this.state.extra_cost : "" ) + "/" + this.state.value;
        }
    });
});