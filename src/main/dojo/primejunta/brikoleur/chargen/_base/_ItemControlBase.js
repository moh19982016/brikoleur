/**
 * Base class for recursively-created item controls. Can be used as-is or may be extended to add more features.
 *
 * @public Base
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/_base/array",
          "dojo/dom-class",
          "dijit/form/Button",
          "./_DescriptionMixin",
          "./_ControlContainerMixin",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dijit/_WidgetsInTemplateMixin",
          "dojo/text!./templates/_ItemControlBase.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          array,
          domClass,
          Button,
          _DescriptionMixin,
          _ControlContainerMixin,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare( [ _WidgetBase,
                      _TemplatedMixin,
                      _WidgetsInTemplateMixin,
                      _ControlContainerMixin,
                      _DescriptionMixin ],
    {
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
            this.childConstructor = this.parent.childConstructor;
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
        },
        /**
         * If we're allowed to create a child control, .createChildControl on data retrieved from ._store (if any).
         *
         * @stub
         * @public void
         */
        addChildControl : function()
        {
        },
        /**
         * Create a new control with .childConstructor, and properties mixed in from .childProperties and various own
         * properties. Notably, .selectedFeatureTopic gets - and .value tacked on, level is incremented by 1, cost is
         * calculated with .get( "cost" ), data comes from childData if provided, and parent is this. The control
         * is placed in .childrenNode and returned.
         *
         * @param childData
         * @public _ItemControlBase
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
            } ) ).placeAt( this.childrenNode );
            this.controls.push( ctl );
            this.onAddDescendant();
            return ctl;
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
         * Catches "cost" and "state" with .getCost and _getState, respectively.
         *
         * @param prop
         * @public {*}
         */
        get : function( /* string */ prop )
        {
            if( prop == "state" )
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
            if( this.descriptionWidget && this.descriptionWidget.get( "value" ) && this.descriptionWidget.get( "value" ) != this._getData().description )
            {
                this.state.description = this.descriptionWidget.get( "value" );
            }
            this.state.controls = chld;
            this.state.key = this.key;
            return this._getPropsForState( lang.mixin( lang.clone( this._getData( this.state.value ) || {} ), this.state ) );
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
                this.state = lang.mixin( _data, this.state );
                this.setDescription( this.state );
                for( var i = 0; i < ( state.controls || [] ).length; i++ )
                {
                    this._setChildState( state.controls[ i ] );
                }
            }
        },
        /**
         * Return data for item if applicable.
         *
         * @stub
         * @param state
         * @returns {*}
         * @private
         */
        _getData : function( state )
        {
            return {};
        },
        /**
         * Create a child control and set its state to state.
         *
         * @param state
         * @private void
         */
        _setChildState : function( state )
        {
            this.createChildControl( {} ).set( "state", state );
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
            } );
        },
        /**
         * Looks up value from ._selector.value, this.value, or "".
         *
         * @private string
         */
        _readValue : function()
        {
            return this._selector ? this._selector.get( "value" ) : this.value || "";
        }
    } );
} );