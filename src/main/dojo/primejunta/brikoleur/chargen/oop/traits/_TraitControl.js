define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "dojo/dom-construct",
        "./_TraitFeatureControl",
        "../../data/traits",
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
        data : traits,
        selectedFeaturesTopic : "/SelectedTraits/",
        featureAddedTopic : "/TraitAdded/",
        propertyPresentWarning : i18n.TraitPresent,
        maxLevel : 0,
        closed : true,
        templateString : template,
        addItem : function()
        {
            this.inherited( arguments );
            this._processFeatures();
        },
        addFreeFeature : function( kwObj, ctrl )
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
            topic.publish( "/FreeFeatureAdded/", ctrl.key, this.state.free_features );
        },
        _checkGift : function( gift )
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
        _lookupProperty : function( prop, val )
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
        _setState : function( state )
        {
            this.inherited( arguments );
            if( Controller.loading )
            {
                this._processFeatures();
            }
        },
        _processFeatures : function()
        {
            var features = [];
            var data = this._store.get( this.get( "state" ).value );
            if( data )
            {
                features = data.features || [];
            }
            this._displayFeatures( features );
        },
        _displayFeatures : function( features )
        {
            for( var i = 0; i < features.length; i++ )
            {
                switch( features[ i ].type )
                {
                    case "knack" :
                        if( !Controller.loading )
                        {
                            topic.publish( "/AddBonusKnack/", features[ i ].value );
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
                    default :
                        this._printFeature( features[ i ] );

                }
            }
        },
        _printFeature : function( feature, refNode, pos )
        {
            domConstruct.create( "li", { innerHTML : "<b>" + feature.name + ":</b> " + feature.value }, refNode || this.featuresNode, pos || "last" );
        }
    });
});