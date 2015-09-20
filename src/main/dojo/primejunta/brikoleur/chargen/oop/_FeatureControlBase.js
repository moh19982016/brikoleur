define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/topic",
        "../FilteringMemory",
        "dijit/popup",
        "dijit/Tooltip",
        "dojo/dom-construct",
        "../util",
        "./_PropertySelector",
        "./_PropertyControl",
        "dijit/form/Select",
        "dijit/form/ComboBox",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
    function( declare,
              lang,
              on,
              topic,
              FilteringMemory,
              popup,
              Tooltip,
              domConstruct,
              util,
              _PropertySelector,
              _PropertyControl,
              Select,
              ComboBox,
              _WidgetBase,
              _TemplatedMixin,
              _WidgetsInTemplateMixin,
              i18n )
    {
        return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
            dict : i18n,
            manager : {},
            feature : {},
            featureName : "",
            postCreate : function()
            {
                topic.subscribe( this.selectedFeaturesTopic, lang.hitch( this, this._setFilter ) );
                this._selectors = [];
                this._property = [];
                this.property = [];
                this._store = new FilteringMemory({
                    data : util.listToStoreData( this.feature.list )
                });
                this.cost = this.feature.cost || 0;
                this.createSelector();
            },
            createSelector : function()
            {
                if( this._selector )
                {
                    this._selector.destroy();
                }
                this._selector = new ComboBox({
                    store : this._store,
                    searchAttr : "name",
                    onChange : lang.hitch( this, this.featureSelected )
                } ).placeAt( this.selectorNode );
                this._selector.startup();
            },
            featureSelected : function()
            {
                if( this._selector.get( "value" ) == this.value )
                {
                    return;
                }
                if( this.propertySelector )
                {
                    this.propertySelector.destroy();
                }
                var item = this.get( "item" );
                this.propertySelector = new _PropertySelector({
                    manager : this,
                    item : item,
                    cost : this.cost,
                    combat : item.combat,
                    featureName : this._selector.get( "value" )
                }).placeAt( this.propertySelectorNode );
                this.valueNode.innerHTML = this.get( "value" );
                topic.publish( this.featureSelectedTopic, item );
            },
            addProperty : function( item )
            {
                if( util.itemInArray( this._property, item, true ) )
                {
                    util.showWarning( this.propertyPresentWarning, this.propertySelector.domNode );
                }
                else
                {
                    this._property.push( new _PropertyControl({
                        manager : this,
                        item : item,
                        cost : this.cost,
                        combat : this._store.get( this._selector.get( "value" ) ).combat,
                        featureName : this._selector.get( "value" )
                    } ).placeAt( this.propertyNode ) );
                    this.property.push( item.id );
                }
            },
            get : function( prop )
            {
                return util.get( prop, this._selector, this._store ) || this.inherited( arguments );
            },
            _setFilter : function( filter )
            {
                this._store.filter = filter;
                this.value = this._selector ? this._selector.get( "value" ) : "";
                this.createSelector();
                this._selector.set( "value", this.value );
            }
        });
    });