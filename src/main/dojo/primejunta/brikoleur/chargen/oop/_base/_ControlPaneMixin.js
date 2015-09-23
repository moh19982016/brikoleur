define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/topic",
        "./../../_base/util" ],
function( declare,
          lang,
          array,
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
                this.addControl( kwObj );
            }
            if( !Controller.loading )
            {
                topic.publish( this.selectedFeaturesTopic, util.getValues( this.controls ) );
            }
            if( this.minimized && this.maximize )
            {
                this.maximize();
            }
        },
        addControl : function( kwObj )
        {
            var ctl = new this.featureControl( lang.mixin( kwObj || {}, { parent : this } )).placeAt( this.containerNode );
            this.controls.push( ctl );
            return ctl;
        },
        countItems : function()
        {
            return util.countItems( this.controls );
        },
        descendantFeatureAdded : function()
        {
        },
        clear : function()
        {
            while( this.controls.length > 0 )
            {
                this.controls.pop().destroy();
            }
        },
        _setState : function( state )
        {
            this.clear();
            for( var i = 0; i < state.length; i++ )
            {
                this.addControl().set( "state", state[ i ] );
            }
        }
    });
});