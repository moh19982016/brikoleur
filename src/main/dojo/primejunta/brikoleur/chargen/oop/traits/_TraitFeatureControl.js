define([ "dojo/_base/declare",
    "dojo/_base/lang",
        "dojo/topic",
    "dijit/form/Button",
    "dijit/form/Select",
    "dijit/form/TextBox",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/_TraitFeatureControl.html",
    "dojo/i18n!./../../../nls/CharGen" ],
function( declare, lang, topic, Button, Select, TextBox, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, i18n )
{
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        manager : {},
        key : "",
        max : 1,
        dict : i18n,
        selector : true,
        value : "",
        templateString : template,
        postCreate : function()
        {
            if( !this.selector )
            {
                this.typeNode.innerHTML = this.value;
                this.typeNode.style.display = "inline";
                this.typeSelect.domNode.style.display = "none";
            }
            this._count = 0;
            this.own( topic.subscribe( "/FreeFeatureAdded/", lang.hitch( this, this.checkCap ) ) );
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
            this.addButton.set( "disabled", !this.descriptionInput.get( "value" ) );
        },
        addFeature : function()
        {
            this.manager.addFreeFeature({
                type : this.selector ? this.typeSelect.get( "value" ) : this.value,
                name : this.selector ? this.typeSelect.get( "displayedValue" ) : this.value,
                value : this.descriptionInput.get( "value" )
            }, this );
            this.clear();
        },
        clear : function()
        {
            this.typeSelect.set( "value", this.typeSelect.options[ 0 ].value );
            this.descriptionInput.set( "value", "" );
            this.checkAdd();
        }
    });
});