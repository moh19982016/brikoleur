/**
 * Task resolver pane.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "./../../oop/stunts/_StuntControl",
          "./../_base/_PoweredAbilityInPlayMixin",
          "dojo/text!./templates/_StuntControl.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          on,
          _StuntControl,
          _PoweredAbilityInPlayMixin,
          template,
          i18n )
{
    return declare( [ _StuntControl, _PoweredAbilityInPlayMixin ],
    {
        stat : "body",
        popupMessage : i18n.SpendBodyPoints,
        statTooLowMessage : i18n.BodyTooLow,
        templateString : template,
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( on( this.valueNode, "click", lang.hitch( this, this.pleaseUsePower ) ) );
        }
    } );
} );