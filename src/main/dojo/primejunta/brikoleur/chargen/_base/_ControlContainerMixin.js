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
            this.addFeature();
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