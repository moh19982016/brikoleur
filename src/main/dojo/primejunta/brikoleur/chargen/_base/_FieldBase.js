define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/_base/array",
         "dojo/on",
         "dojo/topic",
         "dijit/form/TextBox",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojo/text!./templates/_FieldBase.html" ],
function( declare,
          lang,
          array,
          on,
          topic,
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
        inputProperties : [ "value", "disabled", "readonly", "selectedIndex", "options" ],
        inputClass : "br-inputField",
        readonly : false,
        buildRendering : function()
        {
            this.inherited( arguments );
            this.makeInput();
        },
        makeInput : function()
        {
            this._input = new this.inputWidget({ name : this.name, readonly : this.readonly, onChange : this.onChange, "class" : this.inputClass }).placeAt( this.controlNode );
            this.own( this._input, on( this._input, "change", lang.hitch( this, this.publishChange ) ) );
        },
        publishChange : function()
        {
            topic.publish( "/PropertyChanged/", this.get( "state" ).name, this.get( "state" ).value );
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
                if( array.indexOf( this.inputProperties, prop ) != -1 )
                {
                    this._input.set( prop, val );
                }
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
            this._input.set( "value", state.value );
        }
    });
});