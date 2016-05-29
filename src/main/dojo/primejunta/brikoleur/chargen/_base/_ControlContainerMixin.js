/**
 * Mixin with features related to contained controls.
 *
 * @public Mixin
 */
define([ "dojo/_base/declare",
         "./util" ],
function( declare,
          util )
{
    return declare([], {
        postCreate : function()
        {
            this.inherited( arguments );
            this.set( "allowedControls", this._allowedControls );
        },
        /**
         * Returns values of .controls as string[].
         *
         * @public string[]
         */
        listFeatures : function()
        {
            var out = [];
            for( var i = 0; i < this.controls.length; i++ )
            {
                out.push( this.controls[ i ].value );
            }
            return out;
        },
        onRemoveChild : function( child )
        {
            for( var i = 0; i < this.controls.length; i++ )
            {
                if( this.controls[ i ] == child )
                {
                    this.controls.splice( i, 1 );
                    break;
                }
            }
            this.displayCount();
            this.addFeature();
        },
        onCompleteChild : function( child )
        {
            this.displayCount();
        },
        /**
         * Returns count of descendant controls as int.
         *
         * @public int
         */
        countItems : function()
        {
            return util.countItems( this.controls ) + ( this.value ? 1 : 0 );
        },
        countAllowedItems : function()
        {
            var items = 0;
            for( var i = 0; i < this.controls.length; i++ )
            {
                if( this.controls[ i ].complete )
                {
                    items++;
                }
            }
            return items;
        },
        set : function( prop, val )
        {
            if( prop == "allowedControls" )
            {
                this.displayCount();
            }
            this.inherited( arguments );
        },
        displayCount : function()
        {
            if( !this.countNode )
            {
                return;
            }
            if( !this.allowedControls )
            {
                this.allowedControls = this._allowedControls;
            }
            var items = this.countAllowedItems();
            this._remainingItems = this.allowedControls - items;
            if( this._remainingItems == 0 )
            {
                this.countNode.innerHTML = "";
            }
            else
            {
                this.countNode.innerHTML = " (" + this._remainingItems + ")";
            }

        },
        /**
         * Pops to destroy all controls.
         *
         * @public void
         */
        clear : function()
        {
            while( this.controls.length > 0 )
            {
                this.controls.pop().destroy();
            }
        }
    });
});