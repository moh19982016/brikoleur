define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "dijit/form/TextBox",
        "dijit/form/Button",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-geometry",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/NamePane.html",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          TextBox,
          Button,
          domClass,
          domConstruct,
          domGeometry,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        dict : i18n,
        templateString : template,
        createCharacter : function()
        {
            domClass.toggle( document.body, "br-characterCreated" );
        },
        publishJuju : function()
        {
            topic.publish( "/JujuChanged/", this.jujuInput.get( "value" ) );
        }
    });
});