define([ "dojo/_base/declare",
         "dojo/_base/lang",
        "dojo/topic",
        "dojo/_base/array",
        "dojo/json",
        "dojo/dom-class",
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
        "./store/CharacterStore",
         "dijit/layout/LayoutContainer",
         "dijit/layout/TabContainer",
         "dijit/layout/ContentPane",
         "dijit/form/NumberTextBox",
         "dijit/form/TextBox",
        "dijit/form/DropDownButton",
        "dijit/DropDownMenu",
        "dijit/MenuItem",
        "dijit/form/Button",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!./templates/Controller.html",
         "dojo/i18n!../nls/CharGen" ],
function( declare,
          lang,
          topic,
          array,
          json,
          domClass,
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
          CharacterStore,
          LayoutContainer,
          TabContainer,
          ContentPane,
          NumberTextBox,
          TextBox,
          DropDownButton,
          DropDownMenu,
          MenuItem,
          Button,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    var Constr = declare([ LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin  ], {
        dict : i18n,
        templateString : template,
        _panes : {},
        postCreate : function()
        {
            window.Controller = this;
            domClass.replace( document.body, "tundra", "claro" );
            this.newCharacterButton = new Button({ label : i18n.NewCharacter, "class" : "br-headerButton", iconClass : "fa fa-sun-o br-gold", onClick : lang.hitch( this, this.newCharacter) } ).placeAt( this.headerContentNode, "first" );
            this._rosterMenu = new DropDownMenu();
            var keys = CharacterStore.list();
            for( var i = 0; i < keys.length; i++ )
            {
                this._rosterMenu.addChild( new MenuItem({
                    label: keys[ i ],
                    onClick: lang.hitch( this, this.loadCharacter, keys[ i ] )
                }));
            }
            this._rosterMenu.startup();
            this.rosterButton = new DropDownButton({ dropDown : this._rosterMenu, label : i18n.Roster, "class" : "br-headerButton", iconClass : "fa fa-users" } ).placeAt( this.headerContentNode, "first" );
            this.rosterButton.startup();
            this.own( this._rosterMenu, this.rosterButton, this.newCharacterButton );
            this._addPane( "name", new NamePane().placeAt( this.nameContainer ) );
            this._addPane( "traits", new TraitsPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "knacks", new KnacksPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "numbers", new NumbersPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "powers", new PowersPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "ohun", new OhunPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "stunts", new StuntsPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "gear", new GearPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "description", new DescriptionPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this.loadSettings();
        },
        loadSettings : function()
        {
            this.set( "juju", CharacterStore.get( "juju" ) || 0 );
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
        newCharacter : function()
        {
            this.saveCharacter();
            this.clear();
        },
        loadCharacter : function( name, dontSave )
        {
            if( !dontSave )
            {
                this.saveCharacter();
            }
            this.set( "state", CharacterStore.load( name ) );
        },
        isValidName : function( name )
        {
            return !CharacterStore.nameInUse( name );
        },
        saveCharacter : function()
        {
            if( this._panes.name.get( "state" ).characterName )
            {
                CharacterStore.save( this._panes.name.get( "state" ).characterName, this.get( "state" ) );
            }
        },
        deleteCharacter : function()
        {
            if( this._panes.name.get( "state" ).characterName && confirm( "U SURE M8???" ) )
            {
                CharacterStore.remove( this._panes.name.get( "state" ).characterName );
                this.clear();
            }
        },
        revertCharacter : function()
        {
            if( this._panes.name.get( "state" ).characterName )
            {
                this.loadCharacter( this._panes.name.get( "state" ).characterName, true );
            }
        },
        publishJuju : function()
        {
            var juju = this.jujuInput.get( "value" );
            CharacterStore.set( "juju", juju );
            topic.publish( "/StatChanged/-juju", juju );
        },
        clear : function()
        {
            var pn = this.domNode.parentNode;
            this.destroy();
            new Constr().placeAt( pn ).startup();
        },
        get : function( prop )
        {
            if( prop == "juju" )
            {
                return this.jujuInput.get( "value" );
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
                this.jujuInput.set( "value", val );
            }
            else if( prop == "state" )
            {
                this.loading = true;
                for( var o in this._panes )
                {
                    this._panes[ o ].set( "state", val[ o ] );
                }
                this.publishJuju();
                topic.publish( "/PleasePublishStatus/", true );
                this.loading = false;
            }
            else
            {
                this.inherited( arguments );
            }
        },
        _addPane : function( point, pane )
        {
            this._panes[ point ] = pane;
            this.own( pane );
        }
    });
    return Constr;
});