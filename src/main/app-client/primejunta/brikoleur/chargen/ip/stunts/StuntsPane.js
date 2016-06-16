/**
 * Stunts pane. Otherwise identical to inherited, except different childConstructor and a disabled method.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "./_StuntControl",
          "./../../oop/stunts/StuntsPane" ],
function( declare,
          _StuntControl,
          StuntsPane )
{
    return declare( [ StuntsPane ],
    {
        /**
         * Our own _StuntControl rather than the inherited one.
         *
         * @final
         * @public Function
         */
        childConstructor : _StuntControl,
        /**
         * Disable inherited ::_checkMaximize since we don't want that.
         *
         * @private void
         */
        _checkMaximize : function()
        {
        }
    } );
} );