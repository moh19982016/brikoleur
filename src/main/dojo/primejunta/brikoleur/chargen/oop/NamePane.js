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
        publishJuju : function()
        {
            topic.publish( "/StatChanged/-juju", this.jujuInput.get( "value" ) );
        },
        get : function( prop )
        {
            if( prop == "state" )
            {
                return {
                    characterName : this.nameInput.get( "value" ),
                    juju : this.jujuInput.get( "value" )
                }
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
                this.nameInput.set( "value", val.characterName );
                this.jujuInput.set( "value", val.juju );
            }
            else
            {
                this.inherited( arguments );
            }
        }
    });
});