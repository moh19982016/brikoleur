define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "./_base/DynamicGrid",
         "./oop/NamePane",
         "./oop/DescriptionPane",
         "./oop/GearPane",
         "./oop/KnacksPane",
         "./oop/NumbersPane",
        "./oop/TraitsPane",
        "./oop/PowersPane",
        "./oop/StuntsPane",
        "./oop/OhunPane",
         "dijit/layout/LayoutContainer",
         "dijit/layout/TabContainer",
         "dijit/layout/ContentPane",
         "dijit/form/NumberTextBox",
         "dijit/form/TextBox",
         "dijit/form/Button",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!./templates/Controller.html",
         "dojo/i18n!../nls/CharGen" ],
function( declare,
          lang,
          DynamicGrid,
          NamePane,
          DescriptionPane,
          GearPane,
          KnacksPane,
          NumbersPane,
          TraitsPane,
          PowersPane,
          StuntsPane,
          OhunPane,
          LayoutContainer,
          TabContainer,
          ContentPane,
          NumberTextBox,
          TextBox,
          Button,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare([ LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin  ], {
        dict : i18n,
        templateString : template,
        postCreate : function()
        {
            window.Controller = this;
            this.namePane = new NamePane().placeAt( this.nameContainer );
            this.traitsPane = new TraitsPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid );
            this.knacksPane = new KnacksPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid );
            this.numbersPane = new NumbersPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid );
            this.powersPane = new PowersPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid );
            this.stuntsPane = new StuntsPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid );
            this.ohunPane = new OhunPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid );
            this.gearPane = new GearPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid );
            this.descriptionPane = new DescriptionPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid );
        },
        get : function( prop )
        {
            if( prop == "juju" )
            {
                return this.namePane.jujuInput.get( "value" );
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        set : function( prop, val )
        {
            if( prop == "juju" )
            {
                this.namePane.jujuInput.set( "value", val );
            }
            else
            {
                this.inherited( arguments );
            }
        }
    });
});