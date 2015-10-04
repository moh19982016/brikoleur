/**
 * Base class for recursively-created feature controls. Can be used as-is or may be extended to add more features to
 * the control.
 *
 * @public Base
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/_base/array",
         "dojo/on",
         "dojo/topic",
         "dojo/dom-class",
         "dijit/form/Select",
         "dijit/form/ComboBox",
         "dijit/form/Button",
         "./util",
         "./FilteringMemory",
        "./_DescriptionMixin",
        "./_ControlContainerMixin",
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
          _DescriptionMixin,
          _ControlContainerMixin,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    var Constr = declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _ControlContainerMixin, _DescriptionMixin ], {
        /**
         * Type of feature being controlled.
         *
         * @public string
         */
        type : "",
        /**
         * ID of characteristic to which the feature belongs.
         *
         * @public string
         */
        key : false,
        /**
         * Visible title of feature.
         *
         * @public string
         */
        title : "",
        /**
         * Filter for FilteringMemory store.
         *
         * @public string[]
         */
        filter : [],
        /**
         * Juju cost to buy a new one.
         *
         * @public int
         */
        cost : 0,
        /**
         * Level of feature.
         *
         * @public int
         */
        level : 0,
        /**
         * Max levels allowed. No descendants created past this point.
         *
         * @public int
         */
        maxLevel : 2,
        /**
         * Properties passed to any created child controls.
         *
         * @public Object
         */
        childProperties : {},
        /**
         * Parent control.
         *
         * @public Widget
         */
        parent : false,
        /**
         * Topic for juju change. May change control state.
         *
         * @final
         * @public string
         */
        jujuChangedTopic : "/StatChanged/-juju",
        /**
         * Topic for feature added. May change control state.
         *
         * @final
         * @public string
         */
        featureAddedTopic : "",
        /**
         * Topic for "sibling" feature list. May change filter.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "",
        /**
         * Properties NOT to be included in state; should be looked up in data instead.
         *
         * @final
         * @public string[]
         */
        OMIT_FROM_STATE : [ "list", "powers", "features", "ohun", "link" ],
        /**
         * Data object for the feature.
         *
         * @final
         * @public Object
         */
        data : {},
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
         * Sets pointer to .childConstructor to Constr -- meanign, this constructor function. Needs to be overridden
         * if extended so descendants are of the same type. Initialize controls, state, type, ._store, and
         * createSelector. Subscribe to .jujuChangedTopic, /PleasePublishInfo/, and fire .onJujuChange once to set
         * initial control state.
         *
         * @public void
         */
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
                this.own( this._store, topic.subscribe( this.selectedFeaturesTopic, lang.hitch( this, this._updateFilter ) ) );
            }
            this.own( topic.subscribe( this.jujuChangedTopic, lang.hitch( this, this.onJujuChange ) ) );
            this.own( topic.subscribe( "/PleasePublishInfo/", lang.hitch( this, this.publishInfo ) ) );
            this.onJujuChange( Controller.get( "juju" ) );
        },
        /**
         * Destroy selector if present. If the list is not closed or there are items to choose from, create a
         * Select or ComboBox in ._selector, connected to ._store. Connect ._onSelectorChange to it.
         *
         * @public void
         */
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
                this._selector.own( on( this._selector, "change", lang.hitch( this, this._onSelectorChange ) ) );
                this.own( this._selector );
            }
        },
        /**
         * Check if we mayAdd an item from the current state of the control. If so, .markComplete(), .addChildControl(),
         * fire .parent.onAugmentChild(), subtract any juju cost from Controller.juju, ._publishChanged, and publish
         * .featureAddedTopic.
         *
         * @public void
         */
        pleaseAddItem : function()
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
            if( this.parent && this.parent.onAugmentChild )
            {
                this.parent.onAugmentChild();
            }
            Controller.set( "juju", Controller.get( "juju" ) - this.getCost() );
            this._publishChange();
            topic.publish( this.featureAddedTopic, this );
        },
        /**
         * If parent doesn't already have a matching value, return true; else warn about it and return false.
         *
         * @param value
         * @public boolean
         */
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
        /**
         * Call .addChildControl(), .publishInfo, and .onAddDescendant().
         * 
         * @public void
         */
        addFeature : function()
        {
            this.addChildControl();
            if( !Controller.loading )
            {
                this.publishInfo();
            }
            this.onAddDescendant();
        },
        /**
         * If we're allowed to create a child control, .createChildControl on data retrieved from ._store (if any).
         * 
         * @public void
         */
        addChildControl : function()
        {
            var childData = this._store.get( this.value );
            if( this.level < this.maxLevel )
            {
                this.createChildControl( childData );
            }
        },
        /**
         * Create a new control with .childConstructor, and properties mixed in from .childProperties and various own
         * properties. Notably, .selectedFeatureTopic gets - and .value tacked on, level is incremented by 1, cost is
         * calculated with .get( "cost" ), data comes from childData if provided, and parent is this. The control
         * is placed in .childrenNode and returned.
         * 
         * @param childData
         * @public _FeatureControlBase
         */
        createChildControl : function( /* Object? */ childData )
        {
            var ctl = new this.childConstructor( lang.mixin( lang.clone( this.childProperties ), {
                type : this.type,
                key : this.key,
                maxLevel : this.maxLevel,
                childProperties : this.childProperties,
                featureAddedTopic : this.featureAddedTopic,
                propertyPresentWarning : this.propertyPresentWarning,
                selectedFeaturesTopic : this.selectedFeaturesTopic + "-" + this.value,
                level : this.level + 1,
                cost : this.get( "cost" ),
                data : childData || { id : "", name : "", list : [] },
                parent : this
            })).placeAt( this.childrenNode );
            this.controls.push( ctl );
            return ctl;
        },
        /**
         * Flags self as .complete, and sets UI to match. Then calls parent.onCompleteChild if present.
         *
         * @public void
         */
        markComplete : function()
        {
            this.complete = true;
            this.controlNode.style.display = "none";
            this.displayNode.style.display = "block";
            domClass.add( this.domNode, "br-itemComplete" );
            this.hideDescription();
            if( this.parent && this.parent.onCompleteChild )
            {
                this.parent.onCompleteChild();
            }
        },
        /**
         * Publish .selectedFeaturesTopic plus - and .value with .listFeatures() and synthetic passed down. The
         * synthetic flag is used to distinguish between calls from user-generated events and .set( "state" ).
         *
         * @param synthetic
         * @public void
         */
        publishInfo : function( synthetic )
        {
            topic.publish( this.selectedFeaturesTopic + "-" + this.value, this.listFeatures(), synthetic );
        },
        /**
         * Returns data.cost or this.cost. Extend for more complex cost calculations.
         *
         * @public int
         */
        getCost : function()
        {
            return this.data.cost || this.cost;
        },
        /**
         * When a child has been augmented, .addFeature to make room for another one.
         *
         * @public void
         */
        onAugmentChild : function()
        {
            this.addFeature();
        },
        /**
         * Pass it up the chain to .parent, which may do something with it.
         *
         * @stub
         * @public void
         */
        onAddDescendant : function()
        {
            if( this.parent.onAddDescendant )
            {
                this.parent.onAddDescendant();
            }
        },
        /**
         * Called when child is completed.
         *
         * @stub
         * @public void
         */
        onCompleteChild : function()
        {
        },
        /**
         * If juju < .getCost(), set disabled on self.
         *
         * @param juju
         * @public void
         */
        onJujuChange : function( /* int */ juju )
        {
            this.set( "disabled", juju < this.getCost() );
        },
        /**
         * Catches "cost" and "state" with .getCost and _getState, respectively.
         *
         * @param prop
         * @public {*}
         */
        get : function( /* string */ prop )
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
        /**
         * Catches "value", "state", and "disabled" with ._setValue, ._setState, and ._setDisabled, respectively.
         *
         * @param prop
         * @param val
         * @public void
         */
        set : function( /* string */ prop, /* {*} */ val )
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
                this._setDisabled( val );
            }
            this.inherited( arguments );
        },
        /**
         * Publish /PropertyChanged/ with name and value.
         *
         * @private void
         */
        _publishChange : function()
        {
            topic.publish( "/PropertyChanged/", this.get( "state" ).name, this.get( "state" ).value );
        },
        /**
         * Set value from val, .setDescription (in _DescriptionMixin) from data matching val, and .showDescription().
         *
         * @param val
         * @private void
         */
        _onSelectorChange : function( /* string */ val )
        {
            this.set( "value", val );
            this.setDescription( this._getData( val ) || {} );
            this.showDescription();
        },
        /**
         * Copies properties from data into an Object and returns it, unless said properties are in OMIT_FROM_STATE.
         *
         * @param data
         * @private Object
         */
        _getPropsForState : function( /* Object */ data )
        {
            var out = {};
            if( data )
            {
                for( var o in data )
                {
                    if( array.indexOf( this.OMIT_FROM_STATE, o ) == -1 )
                    {
                        out[ o ] = data[ o ];
                    }
                }
            }
            return out;
        },
        /**
         * Returns state of self and child controls as Object.
         *
         * @private Object
         */
        _getState : function()
        {
            var chld = [];
            for( var i = 0; i < this.controls.length; i++ )
            {
                chld.push( this.controls[ i ].get( "state" ) );
            }
            this.state.controls = chld;
            this.state.key = this.key;
            return this._getPropsForState( this.state );
        },
        /**
         * Starts with .clear(), then sets state and key from state. If there's a value in state, sets .value from that.
         * Looks up data matching the state, and mixes that into this.state. Then _DescriptionMixin::setDescription from
         * it. Finally .createChildControl on each of the .controls in state, and .markComplete.
         *
         * @param state
         * @private
         */
        _setState : function( state )
        {
            this.clear();
            this.state = state;
            this.key = state.key;
            if( state.value )
            {
                this.set( "value", this.state.value );
                var _data = this._getData( this.state.value );
                this.state = lang.mixin( this.state, _data );
                this.setDescription( this.state );
                for( var i = 0; i < ( state.controls || [] ).length; i++ )
                {
                    this.createChildControl( this._store.get( this.value ) ).set( "state", state.controls[ i ] );
                }
                this.markComplete();
            }
        },
        /**
         * Displays val in .valueNode, and sets ._selector value to it (if present).
         *
         * @param val
         * @private void
         */
        _setValue : function( /* string */ val )
        {
            this.valueNode.innerHTML = val;
            if( this._selector )
            {
                this._selector.set( "value", val );
            }
        },
        /**
         * Swaps out CSS styles marking self as disabled or not.
         *
         * @param val
         * @private void
         */
        _setDisabled : function( /* boolean */ val )
        {
            if( val )
            {
                domClass.replace( this.domNode, "br-controlsDisabled", "br-controlsEnabled" );
            }
            else
            {
                domClass.replace( this.domNode, "br-controlsEnabled", "br-controlsDisabled" );
            }
        },
        /**
         * Reads value with ._readValue, updates .state by getting its properties from ._store and mixing it in, then
         * returns it.
         *
         * @private Object
         */
        _readState : function()
        {
            var val = this._readValue();
            return lang.mixin( ( this.state || {} ), this._getPropsForState( this._store.get( val ) ), {
                value : val
            });
        },
        /**
         * Looks up value from ._selector.value, this.value, or "".
         *
         * @private string
         */
        _readValue : function()
        {
            return this._selector ? this._selector.get( "value" ) : this.value || "";
        },
        /**
         * Returns true if one or more children are not complete. We use this to check if we need to create another one.
         *
         * @private boolean
         */
        _hasActiveChild : function()
        {
            return this.controls.length > 0 && util.getProperties( this.controls, { property : "complete", filter : true } ).length != this.controls.length;
        },
        /**
         * Sets ._store.filter to filter, and .createSelector to update its contents.
         *
         * @param filter
         * @private void
         */
        _updateFilter : function( filter )
        {
            this._store.filter = filter;
            this.createSelector();
        },
        /**
         * Looks up data matching key in ._store; if nothing is found or there's no store or key, returns {}.
         *
         * @param key
         * @private Object
         */
        _getData : function( key )
        {
            return this._store ? this._store.get( key ) || {} : {};
        }
    });
    return Constr;
});