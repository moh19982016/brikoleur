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
            this._printFeature( kwObj, ctrl.domNode, "before" );
            ctrl.max--;
            if( ctrl.max == 0 )
            {
                ctrl.destroy();
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
                            this.own( new _TraitFeatureControl({ manager : this, key : features[ i ].name, max : features[ i ].max || 1 } ).placeAt( this.featuresNode ) );
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