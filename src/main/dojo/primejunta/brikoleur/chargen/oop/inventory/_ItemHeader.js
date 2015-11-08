/**
 * Static widget with column headings for inventory items.
 *
 * @private Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dijit/_WidgetsInTemplateMixin",
          "dojo/text!./templates/_ItemHeader.html",
          "dojo/i18n!../../../nls/CharGen" ],
function( declare,
          lang,
          topic,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        /**
         * Type of header (weapon, armour, item).
         *
         * @public string
         */
        type : "item",
        /**
         * Localization.
         *
         * @final
         * @public Object
         */
        dict : i18n,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        set : function( prop, val )
        {
            if( prop == "type" )
            {
                this._setHeader( val );
            }
            this.inherited( arguments );
        },
        /**
         * Display heading for weapon, armour, or anything else, depending on type.
         *
         * @param type
         * @private void
         */
        _setHeader : function( /* string */ type )
        {
            switch( type )
            {
                case "weapon" :
                    this.weaponHeaderNode.style.display = "block";
                    this.armourHeaderNode.style.display = "none";
                    this.gearHeaderNode.style.display = "none";
                    break;
                case "armour" :
                    this.weaponHeaderNode.style.display = "none";
                    this.armourHeaderNode.style.display = "block";
                    this.gearHeaderNode.style.display = "none";
                    break;
                default :
                    this.weaponHeaderNode.style.display = "none";
                    this.armourHeaderNode.style.display = "none";
                    this.gearHeaderNode.style.display = "block";
            }
        }
    } );
} );