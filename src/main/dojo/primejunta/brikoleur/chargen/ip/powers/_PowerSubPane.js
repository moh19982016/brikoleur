/**
 * Power sub-pane. Otherwise identical to inherited one, but uses our own _PowerControl as .childConstructor.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "./../../oop/powers/_PowerSubPane",
          "./_PowerControl" ],
function( declare,
          _PowerSubPane,
          _PowerControl )
{
    return declare( [ _PowerSubPane ],
    {
        /**
         * Our own, rather than the one we inherited.
         *
         * @public Function
         */
        childConstructor : _PowerControl
    } );
} );