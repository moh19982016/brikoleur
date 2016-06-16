/**
 * Control for adding an inventory item. Has a type selector, and will add an item to match when the player clicks
 * on the add button.
 *
 * @private Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dijit/form/Button",
          "dijit/form/Select",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dijit/_WidgetsInTemplateMixin",
          "dojo/text!./templates/_AddItemControl.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          Button,
          Select,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        /**
         * The InventoryPane to which this belongs.
         *
         * @public InventoryPane
         */
        manager : {},
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
        /**
         * Calls manager.addItem with type read from typeSelect.
         *
         * @public void
         */
        addItem : function()
        {
            this.manager.addItem({ value : { type : this.typeSelect.get( "value" ) } });
        }
    } );
} );