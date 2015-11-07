/**
 * Task resolver pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./_StuntControl",
         "./../../oop/stunts/StuntsPane",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          _StuntControl,
          StuntsPane,
          i18n )
{
    return declare( [ StuntsPane ],
    {
        childConstructor : _StuntControl
    } );
});