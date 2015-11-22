/**
 * Character name pane. This also controls the UI for toggling combat.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dijit/form/Button",
          "../../_base/_NamePaneBase",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          Button,
          _NamePaneBase,
          i18n )
{
    return declare( [ _NamePaneBase ], {
        /**
         * Owner pane.
         *
         * @public _IpPane
         */
        manager : {},
        /**
         * Create a toggle button for combat mode and connect it to ::toggleCombat.
         *
         * @public void
         */
        postCreate : function()
        {
            this.combatToggle = new Button( {
                label : i18n.StartCombat,
                "class" : "br-headerButton",
                iconClass : "fa fa-pagelines",
                onClick : lang.hitch( this, this.toggleCombat )
            } ).placeAt( this.buttonContainer );
            this.own( this.combatToggle );
        },
        /**
         * Connect to manager.toggleCombat.
         *
         * @public void
         */
        toggleCombat : function()
        {
            this.manager.toggleCombat( this.combatToggle );
        }
    } );
} );