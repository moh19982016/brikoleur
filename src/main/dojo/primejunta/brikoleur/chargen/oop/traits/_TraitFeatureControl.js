define([ "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/form/Button",
    "dijit/form/Select",
    "dijit/form/TextBox",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/_TraitFeatureControl.html",
    "dojo/i18n!./../../../nls/CharGen" ],
function( declare, lang, Button, Select, TextBox, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, i18n )
{
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        manager : {},
        key : "",
        max : 1,
        dict : i18n,
        templateString : template,
        checkAdd : function()
        {
            this.addButton.set( "disabled", !this.descriptionInput.get( "value" ) );
        },
        addFeature : function()
        {
            this.manager.addFreeFeature({
                type : this.typeSelect.get( "value" ),
                name : this.typeSelect.get( "displayedValue" ),
                value : this.descriptionInput.get( "value" )
            }, this );
        },
        clear : function()
        {
            this.typeSelect.reset();
            this.descriptionInput.reset();
            this.checkAdd();
        }
    });
});