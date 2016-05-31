/**
 * Control used to assign a trait to a character.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dojo/dom-construct",
         "./_TraitFeatureControl",
         "./../../data/traits",
         "./../_base/_FeatureControlBase",
         "dojo/text!./templates/_TraitControl.html",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          domConstruct,
          _TraitFeatureControl,
          traits,
          _FeatureControlBase,
          template,
          i18n )
{
    return declare([ _FeatureControlBase ], {
        /**
         * Maximum depth allowed for descendants for controls of this type.
         *
         * @public int
         */
        maxLevel : 0,
        /**
         * If true, this is a "closed" list -- we'll use a Select rather than a ComboBox as the UI control.
         *
         * @public boolean
         */
        closed : true,
        /**
         * Data for the feature.
         *
         * @public Object
         */
        data : traits,
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedTraits/",
        /**
         * Topic published when a feature of this type is added. Used to update state f.ex. if there are limits to the
         * number of controls we can add.
         *
         * @final
         * @public string
         */
        featureAddedTopic : "/TraitAdded/",
        /**
         * Warning to display if trying add another item with the same name and type.
         *
         * @final
         * @public string
         */
        propertyPresentWarning : i18n.TraitPresent,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then ._processFeatures.
         *
         * @public void
         */
        pleaseAddItem : function()
        {
            this.inherited( arguments );
            this._processFeatures();
        },
        /**
         * Set up container for free_features of type ctrl.key, then push kwObj into it. If it was a Gift, ._checkGift.
         * Then ._printFeature and publish /AddFreeFeature/ topic, which will be used by all _TraitFeatureControls to
         * check their caps.
         *
         * @param kwObj
         * @param ctrl
         * @public void
         */
        addFreeFeature : function( /* Object */ kwObj, /* _TraitFeatureControl */ ctrl )
        {
            this.state = this.state || {};
            this.state.free_features = this.state.free_features || {};
            this.state.free_features[ ctrl.key ] = this.state.free_features[ ctrl.key ] || [];
            this.state.free_features[ ctrl.key ].push( kwObj );
            if( kwObj.type == "Gift" )
            {
                this._checkGift( kwObj );
            }
            this._printFeature( kwObj, ctrl.domNode, "before" );
            topic.publish( "/AddFreeFeature/", ctrl.key, this.state.free_features );
        },
        createSelector : function()
        {
            this.inherited( arguments );
            setTimeout( lang.hitch( this, function()
            {
                if( !this.complete && !this._destroyed )
                {
                    this._onSelectorChange( this._selector.get( "value" ) );
                }
            } ), 1 );
        },
        showDescription : function()
        {

        },
        hideDescription : function()
        {

        },
        /**
         * If the gift was an Ohun or Power, publish a topic to that effect, with data looked up with ._lookupProperty.
         *
         * @param gift
         * @private void
         */
        _checkGift : function( /* string */ gift )
        {
            if( gift.value.indexOf( "Ohun - " ) == 0 )
            {
                topic.publish( "/AddBonusOhun/", this._lookupProperty( "ohun", gift.value.substring( "Ohun - ".length ) ) );
            }
            if( gift.value.indexOf( "Power - " ) == 0 )
            {
                topic.publish( "/AddBonusPower/", this._lookupProperty( "powers", gift.value.substring( "Power - ".length ) ) );
            }
        },
        /**
         * Recurse through traits to find item matching val from property matching prop, and return the result as
         * kwObj with .key and .data. If nothing was found, just return an object designating it as a Zone Gift.
         *
         * @param prop
         * @param val
         * @private Object
         */
        _lookupProperty : function( /* string */ prop, /* string */ val )
        {
            for( var i = 0; i < traits.list.length; i++ )
            {
                for( var j = 0; j < ( traits.list[ i ][ prop ] || [] ).length; j++ )
                {
                    if( traits.list[ i ][ prop ][ j ].name == val )
                    {
                        return {
                            key : traits.list[ i ].name,
                            data : traits.list[ i ][ prop ][ j ]
                        }
                    }
                }
            }
            return {
                key : "Zonetouched",
                data : [{
                    name : "Zone Gift",
                    list : []
                }]
            }
        },
        /**
         * Inherited. Then ._processFeatures (if Controller is loading).
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object */ state )
        {
            this.inherited( arguments );
            if( Controller.loading )
            {
                this._processFeatures();
            }
        },
        /**
         * Lookup data from store, matching current state. If there is any and it contains .features, ._displayFeatures
         * on the result. If any numbers are defined, apply those.
         *
         * @private void
         */
        _processFeatures : function()
        {
            var features = [];
            var data = this._store.get( this.get( "state" ).value );
            if( data )
            {
                features = data.features || [];
                if( data.numbers )
                {
                    for( var i = 0; i < data.numbers.length; i++ )
                    {
                        Controller.characterPane.panes.numbers.set( data.numbers[ i ].name, data.numbers[ i ].value );
                    }
                }
            }
            this._displayFeatures( features );
        },
        _onSelectorChange : function( val )
        {
            this.inherited( arguments );
            var data = this._store.get( val );
            if( data && data.features )
            {
                this._printFeatures( data.features );
            }
        },
        /**
         * Iterate through features and handle the three possible types: "knack," which adds a bonus knack, "free,"
         * which adds a control letting you make one (or recurses with values retrieved from data), or other, which
         * just prints it.
         *
         * @param features
         * @private void
         */
        _displayFeatures : function( /* Object[] */ features )
        {
            domConstruct.empty( this.featuresNode );
            for( var i = 0; i < features.length; i++ )
            {
                switch( features[ i ].type )
                {
                    case "knack" :
                        if( !Controller.loading || Controller.loadingTemplate )
                        {
                            topic.publish( "/AddBonusKnack/", features[ i ].value );
                        }
                        break;
                    case "oga" :
                        if( !Controller.loading || Controller.loadingTemplate )
                        {
                            topic.publish( "/AddBonusKnack/", features[ i ].value, "oga" );
                        }
                        break;
                    case "free" :
                        if( this.state.free_features && this.state.free_features[ features[ i ].name ] )
                        {
                            this._displayFeatures( this.state.free_features[ features[ i ].name ] );
                        }
                        else
                        {
                            this.own( new _TraitFeatureControl( lang.mixin({
                                manager : this,
                                key : features[ i ].name
                            }, features[ i ] ) ).placeAt( this.featuresNode ) );
                        }
                        break;
                    case "discount" :
                        Controller.discounts[ features[ i ].target ] = features[ i ].discount;
                        break;
                    default :
                        this._printFeature( features[ i ] );

                }
            }
            this.showDescription();
        },
        _printFeatures : function( features )
        {
            domConstruct.empty( this.featuresNode );
            if( !features || !features.length )
            {
                return;
            }
            for( var i = 0; i < features.length; i++ )
            {
                this._printFeature( features[ i ] );
            }
        },
        /**
         * Prints out feature description as list item in refNode at pos.
         *
         * @param feature
         * @param refNode
         * @param pos - "before"|"after"|"first"|"last"
         * @private void
         */
        _printFeature : function( /* Object */ feature, /* node */ refNode, /* string */ pos )
        {
            if( !feature.name )
            {
                return;
            }
            else if( feature.value )
            {
                domConstruct.create( "li", { innerHTML : "<b>" + feature.name + ":</b> " + feature.value }, refNode || this.featuresNode, pos || "last" );
            }
            else
            {
                domConstruct.create( "li", { innerHTML : "<b>" + feature.name + "</b>" }, refNode || this.featuresNode, pos || "last" );
            }
        }
    });
});