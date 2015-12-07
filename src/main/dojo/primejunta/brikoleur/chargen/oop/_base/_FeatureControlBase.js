/**
 * Base class for character features, such as knacks, training, powers, ohun etc. Extends _ItemControlBase.
 *
 * @public Base
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/_base/array",
          "dojo/on",
          "dojo/topic",
          "dojo/dom-class",
          "./../../_base/util",
          "./FilteringMemory",
          "dijit/form/Select",
          "dijit/form/ComboBox",
          "dijit/form/Textarea",
          "./../../_base/_ItemControlBase",
          "dojo/text!./templates/_FeatureControlBase.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          array,
          on,
          topic,
          domClass,
          util,
          FilteringMemory,
          Select,
          ComboBox,
          Textarea,
          _ItemControlBase,
          template,
          i18n )
{
    return declare( [ _ItemControlBase ], {
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then create a FilteringMemory and matching selector if needed, subscribe to relevant topics,
         * and fire .onJujuChange to set initial state.
         *
         * @public void
         */
        postCreate : function()
        {
            this.inherited( arguments );
            if( this.data.list ) // we can recurse
            {
                this._store =
                new FilteringMemory( { data : util.listToStoreData( this.data.list ), filter : this.filter } );
                this.createSelector();
                this.own( this._store,
                          topic.subscribe( this.selectedFeaturesTopic, lang.hitch( this, this._updateFilter ) ) );
            }
            this.own( topic.subscribe( this.jujuChangedTopic, lang.hitch( this, this.onJujuChange ) ) );
            this.own( topic.subscribe( "/PleasePublishInfo/", lang.hitch( this, this.publishInfo ) ) );
            this.onJujuChange( Controller.get( "juju" ) );
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
                this._selector =
                new ( this.data.closed ? Select : ComboBox )( {
                    store : this._store,
                    placeholder : i18n.SelectOrType,
                    style : "width:100%;"
                } ).placeAt( this.selectorNode );
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
            if( array.indexOf( util.getProperties( this.parent.controls, { property : "value", self : this } ),
                               value ) != - 1 )
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
         * Intercept "cost" to .getCost.
         *
         * @param prop
         * @public {*}
         */
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
        /**
         * Inherited, then .markComplete if the state had a value.
         *
         * @param state
         * @private void
         */
        _setState : function( state )
        {
            this.inherited( arguments );
            if( state.value )
            {
                this.markComplete();
            }
        },
        /**
         * Call ::createChildControl with value from store, and set its state to state.
         *
         * @param state
         * @private
         */
        _setChildState : function( state )
        {
            this.createChildControl( this._store.get( this.value ) ).set( "state", state );
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
         * Returns true if one or more children are not complete. We use this to check if we need to create another one.
         *
         * @private boolean
         */
        _hasActiveChild : function()
        {
            return this.controls.length >
                   0 &&
                   util.getProperties( this.controls, { property : "complete", filter : true } ).length !=
                   this.controls.length;
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
    } );
} );