define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/_base/array",
         "dojo/topic",
         "./_ControlPaneMixin",
         "./_DescriptionMixin",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojo/text!./templates/_FeatureSubPane.html" ],
function( declare,
          lang,
          array,
          topic,
          _ControlPaneMixin,
          _DescriptionMixin,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare([ _WidgetBase, _TemplatedMixin, _ControlPaneMixin, _DescriptionMixin ], {
        data : {},
        templateString : template,
        allowedControls : -1,
        value : "",
        key : "",
        description : "",
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/PleasePublishStatus/", lang.hitch( this, this.publishStatus ) ) );
            this.setDescription( this.data );
        },
        featureAdded : function( kwObj )
        {
            kwObj = kwObj || {};
            kwObj.key = this.key;
            kwObj.data = this.data;
            this.inherited( arguments, [ kwObj ] );
        },
        pleaseRemove : function( item )
        {
            this.controls.splice( array.indexOf( this.controls, item ), 1 );
            this.publishStatus();
        },
        get : function( prop )
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
        set : function( prop, val )
        {
            if( prop == "state" )
            {
                this._setState( val );
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        _getState : function()
        {
            var ctl = [];
            for( var i = 0; i < this.controls.length; i++ )
            {
                ctl.push( this.controls[ i ].get( "state" ) );
            }
            return {
                name : this.data.name,
                key : this.key,
                controls : ctl
            }
        },
        _setState : function( state )
        {
            this.inherited( arguments );
            this.key = state.key;
            for( var i = 0; i < state.controls.length; i++ )
            {
                this.addControl({ data : this.data }).set( "state", state.controls[ i ] );
            }
        }
    });
});