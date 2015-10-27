/**
 * Character name pane. This also controls the UI for saving, deleting, and reloading the character.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dijit/form/Button",
          "../../_base/_NamePaneBase",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          Button,
          _NamePaneBase,
          i18n )
{
    return declare( [ _NamePaneBase ], {
        manager : {},
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
        toggleCombat : function()
        {
            this.manager.toggleCombat( this.combatToggle );
        }
    } );
} );