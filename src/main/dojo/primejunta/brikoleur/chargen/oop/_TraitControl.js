define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dijit/form/ComboBox",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "./_base/FilteringMemory",
         "../data/traits",
         "./_base/util",
         "dojo/text!./templates/_TraitControl.html",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          ComboBox,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          FilteringMemory,
          traits,
          util,
          template,
          i18n )
{
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        dict : i18n,
        templateString : template,
        postCreate : function()
        {
            var data = util.listToStoreData( traits.list ); //.push({ id : "null", name : "-------" });
            this._store = new FilteringMemory({ data : data, getLabel : function( item ) { return item.name } });
            topic.subscribe( "/SelectedTraits/", lang.hitch( this, this._setFilter ) );
            this.createSelector();
        },
        traitSelected : function()
        {
            this.value = this._selector.get( "value" );
            this.valueNode.innerHTML = this.value;
            topic.publish( "/TraitSelected/", this._store.get( this.value ) );
        },
        createSelector : function()
        {
            if( this._selector )
            {
                this._selector.destroy();
            }
            this._selector = new ComboBox({ store : this._store, value : this.value || "", onChange : lang.hitch( this, this.traitSelected) } ).placeAt( this.selectNode );
        },
        get : function( prop )
        {
            if( prop == "value" )
            {
                var val = util.get( "item", this._selector, this._store );
                if( val.name == i18n.SelectATrait )
                {
                    return false;
                }
                else
                {
                    return val.id;
                }
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        _setFilter : function( filter )
        {
            this._store.filter = filter;
            this.createSelector();
        }
    });
});