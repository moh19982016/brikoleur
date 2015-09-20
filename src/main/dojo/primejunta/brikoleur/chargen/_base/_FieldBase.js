define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dijit/form/TextBox",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojo/text!./../templates/_FieldBase.html" ],
function( declare,
          lang,
          TextBox,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare([ _WidgetBase, _TemplatedMixin ], {
        title : "",
        templateString : template,
        inputWidget : TextBox,
        readonly : false,
        buildRendering : function()
        {
            this.inherited( arguments );
            this._input = new this.inputWidget({ readonly : this.readonly, onChange : this.onChange }).placeAt( this.controlNode );
        },
        onChange : function()
        {
        },
        set : function( prop, val )
        {
            this.inherited( arguments );
            this._input.set( prop, val );
        },
        get : function( prop )
        {
            return this._input.get( prop );
        }
    });
});