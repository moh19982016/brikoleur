define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "dojo/dom-construct",
        "../../data/traits",
        "./../_base/_FeatureControlBase",
        "dojo/text!./templates/_TraitControl.html",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          domConstruct,
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
                    case "resistance" :
                        domConstruct.create( "li", { innerHTML : "<b>" + features[ i ].name + ":</b> " + features[ i ].value }, this.featuresNode );
                        break;
                    case "freetext" :

                        break;
                    default :
                        domConstruct.create( "li", { innerHTML : "<b>" + features[ i ].name + ( features[ i ].value ? " - " + features[ i ].value : "" ) + ":</b> " + features[ i ].description }, this.featuresNode );

                }
            }
        }
    });
});