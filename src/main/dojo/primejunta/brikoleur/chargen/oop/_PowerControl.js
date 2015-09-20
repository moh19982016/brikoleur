define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "dojo/dom-class",
        "../data/stunts",
        "./_FeatureControlBase",
        "dojo/text!./templates/_PowerControl.html",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          domClass,
          stunts,
          _FeatureControlBase,
          template,
          i18n )
{
    return declare([ _FeatureControlBase ], {
        feature : stunts,
        selectedFeaturesTopic : "/SelectedStunts/",
        featureSelectedTopic : "/StuntSelected/",
        propertyPresentWarning : i18n.TrainingPresent,
        templateString : template,
        postCreate : function()
        {
            this.inherited( arguments );
            domClass.add( this.domNode, "br-powerSelectMode" );
            this.stunts = [];
            topic.subscribe( this.featureSelectedTopic, lang.hitch( this, function( feature )
            {
                this.stunts.push( feature );
                topic.publish( this.selectedFeaturesTopic, this.stunts );
            }));
        },
        pleaseAddItem : function()
        {
            domClass.replace( this.domNode, "br-powerSelectedMode", "br-powerSelectMode" );
            topic.publish( "/StuntAdded/", this.value );
        }
    });
});