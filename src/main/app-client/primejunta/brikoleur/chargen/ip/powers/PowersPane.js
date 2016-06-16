/**
 * Powers pane. Disables _checkActivePowers since we don't want that in-play, and uses own _PowerSubPane as child
 * constructor.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "./../../oop/powers/PowersPane",
          "./_PowerSubPane" ],
function( declare,
          PowersPane,
          _PowerSubPane )
{
    return declare( [ PowersPane ],
    {
        /**
         * It's our own _PowerSubPane, not the one we inherited.
         *
         * @public Function
         */
        childConstructor : _PowerSubPane,
        /**
         * Do nothing. If we don't disable this, the cost calculations in the OOP pane go haywire.
         *
         * @private void
         */
        _checkActivePowers : function()
        {
        }
    } );
} );