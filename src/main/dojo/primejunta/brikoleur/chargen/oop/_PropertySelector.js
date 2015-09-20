define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/store/Memory",
        "dojo/dom-construct",
        "dijit/form/Button",
        "dijit/form/Select",
        "dijit/form/ComboBox",
        "./_PropertyControlBase",
        "dojo/text!./templates/_TrainingSelector.html",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          Memory,
          domConstruct,
          Button,
          Select,
          ComboBox,
          _PropertyControlBase,
          template,
          i18n )
{
    return declare([ _PropertyControlBase ], {
        templateString : template,
        listAttr : "evolve",
        postCreate : function()
        {
            this.inherited( arguments );
            this._store.filter = this.manager.property;
        },
        addItem : function( item )
        {
            this.manager.addProperty( item );
        }
    });
});