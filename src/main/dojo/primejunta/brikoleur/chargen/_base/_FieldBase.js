define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dijit/form/TextBox",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojo/text!./templates/_FieldBase.html" ],
function( declare,
          lang,
          TextBox,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare([ _WidgetBase, _TemplatedMixin ], {
        title : "",
        name : "",
        templateString : template,
        inputWidget : TextBox,
        readonly : false,
        buildRendering : function()
        {
            this.inherited( arguments );
            this._input = new this.inputWidget({ name : this.name, readonly : this.readonly, onChange : this.onChange }).placeAt( this.controlNode );
        },
        onChange : function()
        {
        },
        set : function( prop, val )
        {
            if( prop == "state" )
            {
                this._setState( val );
            }
            else
            {
                this.inherited( arguments );
                this._input.set( prop, val );
            }
        },
        get : function( prop )
        {
            if( prop == "state" )
            {
                return this._getState();
            }
            else
            {
                return this._input.get( prop );
            }
        },
        _getState : function()
        {
            return {
                name : this.name,
                value : this._input.get( "value" )
            }
        },
        _setState : function( state )
        {
            this.name = state.name;
            this._input.set( "value", state.value );
        }
    });
});