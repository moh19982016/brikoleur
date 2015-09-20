define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "./../../_base/util" ],
function( declare,
          lang,
          topic,
          util )
{
    return declare([ ], {
        allowedControls : 0,
        postCreate : function()
        {
            this.controls = [];
            this.featureAdded();
        },
        featureAdded : function( kwObj )
        {
            if( this.allowedControls < 0 || this.controls.length < this.allowedControls )
            {
                this.controls.push( new this.featureControl( lang.mixin( kwObj || {}, { parent : this } )).placeAt( this.containerNode ) );
            }
            topic.publish( this.selectedFeaturesTopic, util.getValues( this.controls ) );
            if( this.minimized && this.maximize )
            {
                this.maximize();
            }
        },
        descendantFeatureAdded : function()
        {
        }
    });
});