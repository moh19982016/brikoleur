define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/store/Memory",
        "dojo/dom-construct",
        "dijit/form/Button",
        "dijit/form/Select",
        "dijit/form/ComboBox",
        "../util",
        "./_PropertyControlBase",
        "dojo/text!./templates/_PropertyControl.html",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          Memory,
          domConstruct,
          Button,
          Select,
          ComboBox,
          util,
          _PropertyControlBase,
          template,
          i18n)
{
    return declare([ _PropertyControlBase ], {
        templateString : template,
        listAttr : "evolve",
        postMixInProperties : function()
        {
            this.evolve = [];
        },
        addItem : function( item )
        {
            this._store.filter.push( item.id );
            this.evolve.push( item.id );
            domConstruct.create( "div", { innerHTML : item.name }, this.propertyNode );
        }
    });
});