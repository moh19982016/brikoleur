define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/topic",
        "dojo/dom-class",
        "dijit/form/Select",
        "dijit/form/ComboBox",
        "dijit/form/Button",
        "./../../_base/util",
        "./FilteringMemory",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/_FeatureControlBase.html",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          array,
          topic,
          domClass,
          Select,
          ComboBox,
          Button,
          util,
          FilteringMemory,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    var Constr = declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        data : {},
        dict : i18n,
        title : "",
        filter : [],
        cost : 0,
        level : 0,
        parent : false,
        type : "",
        maxLevel : 2,
        templateString : template,
        jujuChangedTopic : "/JujuChanged/",
        featureAddedTopic : "",
        selectedFeaturesTopic : "",
        childProperties : {},
        postCreate : function()
        {
            this.controls = [];
            if( this.data.type )
            {
                this.type = this.data.type;
            }
            if( this.data.list ) // we can recurse
            {
                this._store = new FilteringMemory({ data : util.listToStoreData( this.data.list ), filter : this.filter });
                this.createSelector();
                this.own( topic.subscribe( this.selectedFeaturesTopic, lang.hitch( this, this._updateFilter ) ) );
            }
            this.own( topic.subscribe( this.jujuChangedTopic, lang.hitch( this, this.onJujuChange ) ) );
            this.onJujuChange( Controller.get( "juju" ) );
        },
        createSelector : function()
        {
            if( this._selector )
            {
                this._selector.destroy();
                delete this._selector;
            }
            if( this.data.closed && this._store.query().length == 0 )
            {
                domClass.add( this.controlNode, "br-emptyClosedList" );
            }
            else
            {
                domClass.remove( this.controlNode, "br-emptyClosedList" );
                this._selector = new ( this.data.closed ? Select : ComboBox )({ store : this._store, placeholder : i18n.SelectOrType }).placeAt( this.selectorNode );
            }
        },
        addItem : function()
        {
            var _value = this._selector.get( "value" );
            if( array.indexOf( util.getValues( this.parent.controls ), _value ) != -1 )
            {
                util.showWarning( this.propertyPresentWarning, this._selector.domNode );
                return;
            }
            else if( _value )
            {
                this.set( "value", _value );
            }
            else
            {
                return;
            }
            this.complete = true;
            this.addChildControl();
            if( this.parent )
            {
                this.parent.featureAdded();
            }
            Controller.set( "juju", Controller.get( "juju" ) - this.getCost() );
            this.controlNode.style.display = "none";
            this.displayNode.style.display = "block";
            topic.publish( this.featureAddedTopic, this );
        },
        countItems : function()
        {
            return util.countItems( this.controls ) + ( this.value ? 1 : 0 );
        },
        onJujuChange : function( juju )
        {
            this.set( "disabled", juju < this.getCost() );
        },
        addChildControl : function()
        {
            var child = this._store.get( this.value );
            if( child && child.list || this.level < this.maxLevel )
            {
                this.controls.push( new Constr( lang.mixin( lang.clone( this.childProperties ), {
                    data : child || { id : "", name : "", list : [] },
                    cost : this.get( "cost" ),
                    type : this.type,
                    level : this.level + 1,
                    maxLevel : this.maxLevel,
                    childProperties : this.childProperties,
                    featureAddedTopic : this.featureAddedTopic,
                    selectedFeaturesTopic : this.selectedFeaturesTopic + "-" + this.value,
                    propertyPresentWarning : this.propertyPresentWarning,
                    parent : this
                })).placeAt( this.childrenNode ) );
            }
        },
        featureAdded : function()
        {
            this.addChildControl();
            topic.publish( this.selectedFeaturesTopic + "-" + this.value, this.listFeatures() );
            this.descendantFeatureAdded();
        },
        descendantFeatureAdded : function()
        {
            if( this.parent.descendantFeatureAdded )
            {
                this.parent.descendantFeatureAdded();
            }
        },
        listFeatures : function()
        {
            var out = [];
            for( var i = 0; i < this.controls.length; i++ )
            {
                out.push( this.controls[ i ].value );
            }
            return out;
        },
        getCost : function()
        {
            return this.data.cost || this.cost;
        },
        get : function( prop )
        {
            if( prop == "cost" )
            {
                return this.getCost();
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        set : function( prop, val )
        {
            if( prop == "value" )
            {
                this.valueNode.innerHTML = val;
            }
            else if( prop == "disabled" )
            {
                if( val )
                {
                    domClass.replace( this.domNode, "br-controlsDisabled", "br-controlsEnabled" );
                }
                else
                {
                    domClass.replace( this.domNode, "br-controlsEnabled", "br-controlsDisabled" );
                }
            }
            this.inherited( arguments );
        },
        _updateFilter : function( filter )
        {
            this._store.filter = filter;
            this.createSelector();
        }
    });
    return Constr;
});