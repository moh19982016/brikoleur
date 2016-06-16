/**
 * Utility class for visual effects.
 *
 * @static
 * @public Class
 */
define( [ "dojo/_base/lang",
          "dojo/dom-class" ],
function( lang,
          domClass )
{
    return {
        /**
         * Class name to apply while an FX is in progress.
         *
         * @final
         * @public string
         */
        fxClassName : "br-fxInProgress",
        /**
         * Flash effect. Flashes className on node for duration.
         *
         * @param node
         * @param className
         * @param duration
         * @public void
         */
        flash : function( /* Element */ node, /* string */ className, /* int */ duration )
        {
            duration = duration || 300;
            domClass.add( node, this.fxClassName + " " + className );
            setTimeout( lang.hitch( this, function()
            {
                domClass.remove( node, className );
            } ), duration );
            setTimeout( lang.hitch( this, function()
            {
                domClass.remove( node, this.fxClassName );
            } ), duration * 2 );
        }
    }
} );