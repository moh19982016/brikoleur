/**
 * Content field. Implements form layout with caption and interface for getting and setting state and value. The type
 * of input widget is determined by .inputWidget property.
 *
 * @public Base
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/_base/array",
         "dojo/on",
         "dojo/topic",
         "dojo/dom-class",
         "dijit/form/TextBox",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojo/text!./templates/_FieldBase.html" ],
function( declare,
          lang,
          array,
          on,
          topic,
          domClass,
          TextBox,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare([ _WidgetBase, _TemplatedMixin ], {
        /**
         * Readonly?
         *
         * @public boolean
         */
        readonly : false,
        /**
         * Caption.
         *
         * @final
         * @public string
         */
        title : "",
        /**
         * Field name. Used in state.
         *
         * @final
         * @public string
         */
        name : "",
        /**
         * Input widget.
         *
         * @final
         * @public dijit/form/_FormWidget
         */
        inputWidget : TextBox,
        /**
         * CSS class for inputWidget.
         *
         * @final
         * @public string
         */
        inputClass : "br-inputField",
        /**
         * Caption layout - "across" or "down."
         *
         * @final
         * @public string
         */
        layout : "across",
        /**
         * Properties set/get on .inputWidget when called on self.
         *
         * @final
         * @public string[]
         */
        inputProperties : [ "value", "disabled", "readonly", "selectedIndex", "options" ],
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then set layout, then .makeInput.
         *
         * @public void
         */
        buildRendering : function()
        {
            this.inherited( arguments );
            if( this.layout == "down" )
            {
                domClass.add( this.domNode, "br-layoutDown" );
            }
            this.makeInput();
        },
        /**
         * Create an .inputWidgetin ._input with properties set from self, placed at .controlNode. Then own it and a
         * listener calling ._publishChange if it changes.
         *
         * @public void
         */
        makeInput : function()
        {
            this._input = new this.inputWidget({ name : this.name, readonly : this.readonly, onChange : this.onChange, "class" : this.inputClass }).placeAt( this.controlNode );
            this.own( this._input, on( this._input, "change", lang.hitch( this, this._publishChange ) ) );
        },
        /**
         * Stub, connect to this for good times. Passed to ._input.
         *
         * @stub
         * @public void
         */
        onChange : function()
        {
        },
        /**
         * Tunnels to ._setState if appropriate. If the property being set is in .inputProperties, also sets it on
         * ._input.
         *
         * @param prop
         * @param val
         * @public void
         */
        set : function( /* string */ prop, /* {*} */ val )
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
        /**
         * Returns ._getState for "state," ._input's property if it's .inputProperties, else inherited.
         *
         * @param prop
         * @public {*}
         */
        get : function( /* string */ prop )
        {
            if( prop == "state" )
            {
                return this._getState();
            }
            else if( array.indexOf( this.inputProperties, prop ) != -1 )
            {
                return this._input.get( prop );
            }
            else
            {
                this.inherited( arguments );
            }
        },
        /**
         * Publishes a /PropertyChanged/ topic with name and value.
         *
         * @private void
         */
        _publishChange : function()
        {
            topic.publish( "/PropertyChanged/", this.get( "state" ).name, this.get( "state" ).value );
        },
        /**
         * Returns an Object with .name and .value.
         *
         * @private Object
         */
        _getState : function()
        {
            return {
                name : this.name,
                value : this._input.get( "value" )
            }
        },
        /**
         * Sets input value from state.value. The .name property is ignored as it's not intended to be settable.
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object */ state )
        {
            if( state )
            {
                this._input.set( "value", state.value );
            }
        }
    });
});