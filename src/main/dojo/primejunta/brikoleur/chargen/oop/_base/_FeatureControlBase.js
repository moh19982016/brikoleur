define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
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
          on,
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
        key : false,
        maxLevel : 2,
        templateString : template,
        jujuChangedTopic : "/StatChanged/-juju",
        featureAddedTopic : "",
        selectedFeaturesTopic : "",
        childProperties : {},
        postCreate : function()
        {
            this.childConstructor = Constr;
            this.controls = [];
            this.state = {
                name : this.data.name,
                value : false,
                key : this.key
            };
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
            this.own( topic.subscribe( "/PleasePublishStatus/", lang.hitch( this, this.publishStatus ) ) );
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
                this._selector = new ( this.data.closed ? Select : ComboBox )({ store : this._store, placeholder : i18n.SelectOrType, style : "width:100%;" }).placeAt( this.selectorNode );
                this._selector.own( on( this._selector, "change", lang.hitch( this, this.set, "value" ) ) );
            }
        },
        addItem : function()
        {
            var _value = this._readValue();
            if( _value && this.mayAdd( _value ) )
            {
                this.set( "value", _value );
                this.set( "state", this._readState() );
            }
            else
            {
                return;
            }
            this.markComplete();
            this.addChildControl();
            if( this.parent )
            {
                this.parent.featureAdded();
            }
            Controller.set( "juju", Controller.get( "juju" ) - this.getCost() );
            this.publishChange();
            topic.publish( this.featureAddedTopic, this );
        },
        publishChange : function()
        {
            topic.publish( "/PropertyChanged/", this.get( "state" ).name, this.get( "state" ).value );
        },
        markComplete : function()
        {
            this.complete = true;
            this.controlNode.style.display = "none";
            this.displayNode.style.display = "block";
            if( this.parent && this.parent.onCompleteChild )
            {
                this.parent.onCompleteChild();
            }
        },
        onCompleteChild : function()
        {
        },
        mayAdd : function( value )
        {
            if( array.indexOf( util.getProperties( this.parent.controls, { property : "value", self : this }), value ) != -1 )
            {
                util.showWarning( this.propertyPresentWarning, this._selector.domNode );
                return false;
            }
            else
            {
                return true;
            }
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
                this.createChildControl( child );
            }
        },
        createChildControl : function( child )
        {
            var ctl = new this.childConstructor( lang.mixin( lang.clone( this.childProperties ), {
                data : child || { id : "", name : "", list : [] },
                cost : this.get( "cost" ),
                type : this.type,
                level : this.level + 1,
                key : this.key,
                maxLevel : this.maxLevel,
                childProperties : this.childProperties,
                featureAddedTopic : this.featureAddedTopic,
                selectedFeaturesTopic : this.selectedFeaturesTopic + "-" + this.value,
                propertyPresentWarning : this.propertyPresentWarning,
                parent : this
            })).placeAt( this.childrenNode );
            this.controls.push( ctl );
            return ctl;
        },
        featureAdded : function()
        {
            this.addChildControl();
            if( !Controller.loading )
            {
                this.publishStatus();
            }
            this.descendantFeatureAdded();
        },
        publishStatus : function( synthetic )
        {
            topic.publish( this.selectedFeaturesTopic + "-" + this.value, this.listFeatures(), synthetic );
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
            else if( prop == "state" )
            {
                return this._getState();
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
                this._setValue( val );
            }
            else if( prop == "state" )
            {
                this._setState( val );
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
        clear : function()
        {
            while( this.controls.length > 0 )
            {
                this.controls.pop().destroy();
            }
        },
        _setValue : function( val )
        {
            this.valueNode.innerHTML = val;
            if( this._selector )
            {
                this._selector.set( "value", val );
            }
        },
        _readValue : function()
        {
            return this._selector ? this._selector.get( "value" ) : this.value || "";
        },
        _writeValue : function( val )
        {
            this.set( "value",  val );
            this._selector.set( "value", val );
        },
        _readState : function()
        {
            var val = this._readValue();
            return lang.mixin( ( this.state || {} ), this._getDataProps( this._store.get( val ) ), {
                value : val
            });
        },
        _getDataProps : function( data )
        {
            var out = {};
            if( data )
            {
                for( var o in data )
                {
                    if( o != "list" )
                    {
                        out[ o ] = data[ o ];
                    }
                }
            }
            return out;
        },
        _getState : function()
        {
            var chld = [];
            for( var i = 0; i < this.controls.length; i++ )
            {
                chld.push( this.controls[ i ].get( "state" ) );
            }
            this.state.controls = chld;
            this.state.key = this.key;
            return this.state;
        },
        _setState : function( state )
        {
            this.clear();
            this.state = state;
            this.key = state.key;
            if( state.value )
            {
                this.set( "value", state.value );
                this.markComplete();
                for( var i = 0; i < ( state.controls || [] ).length; i++ )
                {
                    this.createChildControl( this._store.get( this.value ) ).set( "state", state.controls[ i ] );
                }
            }
        },
        _updateFilter : function( filter )
        {
            this._store.filter = filter;
            this.createSelector();
        }
    });
    return Constr;
});