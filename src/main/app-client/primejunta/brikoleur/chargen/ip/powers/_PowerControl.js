/**
 * Power control. Extends inherited one with _PoweredAbilityInPlayMixin.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "./../../oop/powers/_PowerControl",
          "./../_base/_PoweredAbilityInPlayMixin",
          "dojo/text!./templates/_PowerControl.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          on,
          _PowerControl,
          _PoweredAbilityInPlayMixin,
          template,
          i18n )
{
    return declare( [ _PowerControl, _PoweredAbilityInPlayMixin ],
    {
        /**
         * We spend mind to use Powers.
         *
         * @final
         * @public string
         */
        stat : "mind",
        /**
         * Message in cost popup.
         *
         * @final
         * @public string
         */
        popupMessage : i18n.SpendMindPoints,
        /**
         * Message if stat is too low.
         *
         * @final
         * @public string
         */
        statTooLowMessage : i18n.MindTooLow,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then set onClick listener for valueNode to ::pleaseUsePower (from _PoweredAbilityInPlayMixin).
         *
         * @final
         * @public string
         */
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( on( this.valueNode, "click", lang.hitch( this, this.pleaseUsePower ) ) );
        }
    } );
} );