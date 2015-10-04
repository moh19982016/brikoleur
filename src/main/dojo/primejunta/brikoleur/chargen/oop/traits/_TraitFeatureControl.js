define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "dojo/store/Memory",
        "dijit/form/ComboBox",
        "dijit/form/Button",
        "dijit/form/Select",
        "dijit/form/TextBox",
        "./../_base/util",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/_TraitFeatureControl.html",
        "dojo/i18n!./../../../nls/CharGen" ],
function( declare,
          lang,
          topic,
          Memory,
          ComboBox,
          Button,
          Select,
          TextBox,
          util,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        manager : {},
        key : "",
        max : 1,
        dict : i18n,
        selector : true,
        value : "",
        list : false,
        templateString : template,
        postCreate : function()
        {
            if( !this.selector )
            {
                this.typeNode.innerHTML = this.value;
                this.typeNode.style.display = "inline";
                this.typeSelect.domNode.style.display = "none";
            }
            if( this.list )
            {
                var store = new Memory({ data : util.listToStoreData( this.list )});
                this.valueInput = new ComboBox({ onChange : lang.hitch( this, this.checkAdd ), style : "width:100%", store : store, placeholder : i18n.SelectOrType } ).placeAt( this.valueInputNode );
                this.own( store );
            }
            else
            {
                this.valueInput = new TextBox({ onChange : lang.hitch( this, this.checkAdd ), style : "width:100%" } ).placeAt( this.valueInputNode );
            }
            this._count = 0;
            this.own( this.valueInput, topic.subscribe( "/FreeaddFeature/", lang.hitch( this, this.checkCap ) ) );
        },
        checkMax : function()
        {
            return this.max;
        },
        checkCap : function( key, features )
        {
            this.max = this.checkMax( features );
            if( key == this.key )
            {
                this._count++;
            }
            if( this._count >= this.max )
            {
                this.domNode.style.display = "none";
            }
            else
            {
                this.domNode.style.display = "list-item";
            }
        },
        checkAdd : function()
        {
            this.addButton.set( "disabled", !this.valueInput.get( "value" ) );
        },
        pleaseAddFeature : function()
        {
            this.manager.addFreeFeature({
                type : this.selector ? this.typeSelect.get( "value" ) : this.value,
                name : this.selector ? this.typeSelect.get( "displayedValue" ) : this.value,
                value : this.valueInput.get( "value" )
            }, this );
            this.clear();
        },
        clear : function()
        {
            this.typeSelect.set( "value", this.typeSelect.options[ 0 ].value );
            this.valueInput.set( "value", "" );
            this.checkAdd();
        }
    });
});