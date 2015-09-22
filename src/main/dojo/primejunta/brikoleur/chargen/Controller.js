define([ "dojo/_base/declare",
         "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/json",
         "./_base/DynamicGrid",
         "./oop/NamePane",
         "./oop/description/DescriptionPane",
         "./oop/gear/GearPane",
         "./oop/knacks/KnacksPane",
         "./oop/numbers/NumbersPane",
        "./oop/traits/TraitsPane",
        "./oop/powers/PowersPane",
        "./oop/stunts/StuntsPane",
        "./oop/ohun/OhunPane",
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
          array,
          json,
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
        _panes : {},
        postCreate : function()
        {
            window.Controller = this;
            this._addPane( "name", new NamePane().placeAt( this.nameContainer ) );
            this._addPane( "traits", new TraitsPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "knacks", new KnacksPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "numbers", new NumbersPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "powers", new PowersPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "ohun", new OhunPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "stunts", new StuntsPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "gear", new GearPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "description", new DescriptionPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
        },
        logState : function()
        {
            console.log( this.get( "state" ) );
        },
        saveState : function()
        {
            window.localStorage._debugState = json.stringify( this.get( "state" ) );
        },
        loadState : function()
        {
            this.set( "state", json.parse( window.localStorage._debugState ) );
        },
        get : function( prop )
        {
            if( prop == "juju" )
            {
                return this._panes.name.jujuInput.get( "value" );
            }
            else if( prop == "state" )
            {
                var out = {};
                for( var o in this._panes )
                {
                    out[ o ] = this._panes[ o ].get( "state" );
                }
                return out;
            }
            else if( array.indexOf( this._panes.numbers.get( "properties" ), prop ) != -1 )
            {
                return this._panes.numbers.get( prop );
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
                this._panes.name.jujuInput.set( "value", val );
            }
            else if( prop == "state" )
            {
                for( var o in this._panes )
                {
                    this._panes[ o ].set( "state", val[ o ] );
                }
            }
            else
            {
                this.inherited( arguments );
            }
        },
        _addPane : function( point, pane )
        {
            this._panes[ point ] = pane;
        }
    });
});