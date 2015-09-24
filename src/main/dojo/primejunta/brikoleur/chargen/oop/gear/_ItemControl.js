define([ "dojo/_base/declare",
    "dojo/_base/lang",
        "dijit/form/CheckBox",
        "dijit/form/Select",
    "dijit/form/TextBox",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/_ItemControl.html",
    "dojo/i18n!../../../nls/CharGen"],
function( declare,
          lang,
          CheckBox,
          Select,
          TextBox,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        parent : {},
        dict : i18n,
        templateString : template,
        chooseType : function()
        {

        },
        pleaseDestroy : function()
        {
            this.parent.pleaseRemove( this );
            this.destroy();
        },
        get : function( prop )
        {
            if( prop == "state" )
            {
                return this._getState();
            }
            else if( prop == "value" )
            {
                return this.activeControl.get( "checked" ) + "|" + this.typeSelect.get( "value" ) + "|" + this.levelInput.get( "value" ) + "|" + this._esc( this.descriptionInput.get( "value" ) );
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        set : function( prop, val )
        {
            if( prop == "value" && val )
            {
                var values = val.split( "|" );
                this.activeControl.set( "checked", values[ 0 ] == "true" );
                this.typeSelect.set( "value", values[ 1 ] );
                this.levelInput.set( "value", parseInt( values[ 2 ] ) );
                this.descriptionInput.set( "value", this._unesc( values[ 3 ] ) );
            }
        },
        _getState : function()
        {
            return { value : this.get( "value" ) };
        },
        _esc : function( str )
        {
            return str.replace( /\|/g, "&bar;" );
        },
        _unesc : function( str )
        {
            return str.replace( /\&bar;/g, "|" );
        }
    });
});