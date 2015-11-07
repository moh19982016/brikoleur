/**
 * Task resolver pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../oop/powers/_PowerSubPane",
         "./_PowerControl",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          _PowerSubPane,
          _PowerControl,
          i18n )
{
    return declare( [ _PowerSubPane ],
    {
        childConstructor : _PowerControl
    } );
});