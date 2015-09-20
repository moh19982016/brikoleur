define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "./util" ],
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
        featureAdded : function()
        {
            if( this.controls.length < this.allowedControls )
            {
                this.controls.push( new this.featureControl( { parent : this } ).placeAt( this.containerNode ) );
            }
            topic.publish( this.selectedFeaturesTopic, util.getValues( this.controls ) );
        },
        descendantFeatureAdded : function()
        {
        }
    });
});