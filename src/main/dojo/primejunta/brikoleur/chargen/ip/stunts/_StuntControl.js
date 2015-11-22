/**
 * Stunt control. Extends inherited one with _PoweredAbilityInPlayMixin.
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
        /**
         * Spend body to use stunts.
         *
         * @final
         * @public string
         */
        stat : "body",
        /**
         * Message for cost popup.
         *
         * @final
         * @public string
         */
        popupMessage : i18n.SpendBodyPoints,
        /**
         * Message if body is too low to use the stunt.
         *
         * @final
         * @public string
         */
        statTooLowMessage : i18n.BodyTooLow,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then set onClick listener to ::pleaseUsePower (from _PoweredAbilityInPlayMixin).
         */
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( on( this.valueNode, "click", lang.hitch( this, this.pleaseUsePower ) ) );
        }
    } );
} );