define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "../FilteringMemory",
        "dojo/dom-construct",
        "dijit/form/Button",
        "dijit/form/Select",
        "dijit/form/ComboBox",
        "../util",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          FilteringMemory,
          domConstruct,
          Button,
          Select,
          ComboBox,
          util,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          i18n )
{
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        dict : i18n,
        item : {},
        manager : {},
        cost : 0,
        combat : false,
        featureName : "",
        postCreate : function()
        {
            this._store = new FilteringMemory({ data : util.listToStoreData( this.item[ this.listAttr ] || [] ), getLabel : function( item ) { return item.name } });
            topic.subscribe( "/JujuChanged/", lang.hitch( this, this.checkState ) );
            this.createSelector();
            this.checkState( CharacterGenerator.get( "juju" ) );
        },
        checkState : function( juju )
        {
            this.controlNode.style.display = juju < this.cost || this.inactive ? "none" : "block";
        },
        createSelector : function()
        {
            if( this._selector )
            {
                this._selector.destroy();
            }
            if( this.item.closed )
            {
                if( this._store.query().length > 0 )
                {
                    this._selector = new Select( {
                        store: this._store,
                        searchAttr: "name"
                    } ).placeAt( this.selectNode );
                }
                else
                {
                    this.deactivate();
                    return;
                }
            }
            else
            {
                this._selector = new ComboBox({
                    store : this._store,
                    searchAttr : "name"
                } ).placeAt( this.selectNode );
            }
            this._selector.startup();
        },
        pleaseAddItem : function( evt )
        {
            if( evt )
            {
                evt.stopPropagation();
            }
            var item = this._store.get( this._selector.get( "value" ) );
            if( !item )
            {
                item = { id : this._selector.get( "value" ), name : this._selector.get( "value" ) }
            }
            if( !item.id )
            {
                return;
            }
            if( this.combat ) // FIXME: topology violation!
            {
                topic.publish( "/CombatTrainingAdded/", this.featureName );
            }
            this.addItem( item );
            this.createSelector();
            CharacterGenerator.set( "juju", CharacterGenerator.get( "juju" ) - this.cost );
        },
        addItem : function( item )
        {
        },
        deactivate : function()
        {
            this.inactive = true;
            this.controlNode.style.display = "none !important";
        }
    });
});