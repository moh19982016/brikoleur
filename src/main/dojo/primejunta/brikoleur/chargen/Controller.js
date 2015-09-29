define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dojo/_base/array",
         "dojo/json",
         "dojo/string",
         "dojo/dom-class",
         "dojo/dom-geometry",
         "dojo/Deferred",
         "./_Splash",
         "./oop/_base/util",
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
          string,
          domClass,
          domGeometry,
          Deferred,
          _Splash,
          util,
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
        SMALL_THRESHOLD : 650,
        templateString : template,
        controls : {},
        manualUrl : "http://www.brikoleur.com/index.html",
        postMixInProperties : function()
        {
            domClass.add( document.body, "br-hasLoaded" );
        },
        postCreate : function()
        {
            window.Controller = this;
            this.set( "is_new", true );
            domClass.replace( document.body, "tundra", "claro" );
            if( this.hasFullScreen() )
            {
                this.own( new Button({ label : "", "class" : "br-headerButton br-darkButton br-floatRight br-compactButton", iconClass : "fa fa-arrows", onClick : lang.hitch( this, this.toggleFullScreen) } ).placeAt( this.headerContentNodeRight, "first" ) );
            }
            this.newCharacterButton = new Button({ label : i18n.NewCharacter, "class" : "br-headerButton br-darkButton", iconClass : "fa fa-sun-o br-gold", onClick : lang.hitch( this, this.newCharacter) } ).placeAt( this.headerContentNode, "first" );
            this._ekipMenu = new DropDownMenu();
            this._ekipMenu.startup();
            this.ekipButton = new DropDownButton({ dropDown : this._ekipMenu, label : i18n.Ekip, "class" : "br-headerButton br-darkButton", iconClass : "fa fa-users" } ).placeAt( this.headerContentNode, "first" );
            this.ekipButton.startup();
            this.refreshEkip();
            this.own( this._ekipMenu, this.ekipButton, this.newCharacterButton );
            this._addPane( "name", new NamePane().placeAt( this.nameContainer ) );
            this._addPane( "traits", new TraitsPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "knacks", new KnacksPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "numbers", new NumbersPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "powers", new PowersPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "ohun", new OhunPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "stunts", new StuntsPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "gear", new GearPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "description", new DescriptionPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this.loadSettings();
        },
        fadeIn : function()
        {
            setTimeout( lang.hitch( this, function()
            {
                this.domNode.style.opacity = 1;
            }), 1 );
        },
        fadeOut : function()
        {
            setTimeout( lang.hitch( this, function()
            {
                this.domNode.style.opacity = 0;
            }), 1 );
        },
        hasFullScreen : function()
        {
            return !!( document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen );
        },
        toggleFullScreen : function()
        {
            if( !document.fullscreenElement &&    // alternative standard method
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement &&
                !document.msFullscreenElement )
            {
                domClass.add( document.body, "em-fullScreen" );
                // current working methods
                if( document.documentElement.requestFullscreen)
                {
                    document.documentElement.requestFullscreen();
                }
                else if( document.documentElement.msRequestFullscreen)
                {
                    document.documentElement.msRequestFullscreen();
                }
                else if( document.documentElement.mozRequestFullScreen)
                {
                    document.documentElement.mozRequestFullScreen();
                }
                else if( document.documentElement.webkitRequestFullscreen)
                {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            }
            else
            {
                domClass.remove( document.body, "em-fullScreen" );
                if( document.exitFullscreen)
                {
                    document.exitFullscreen();
                }
                else if( document.msExitFullscreen)
                {
                    document.msExitFullscreen();
                }
                else if( document.mozCancelFullScreen)
                {
                    document.mozCancelFullScreen();
                }
                else if( document.webkitExitFullscreen)
                {
                    document.webkitExitFullscreen();
                }
            }
        },
        loadSettings : function()
        {
            var charName = CharacterStore.get( "character" );
            this.splash = window._splash || new _Splash({ style : "opacity:0" } ).placeAt( document.body );
            window._splash = this.splash;
            this.splash.manager = this;
            if( charName && array.indexOf( CharacterStore.list(), charName ) != -1 )
            {
                this.domNode.style.opacity = 1;
                if( window._splash )
                {
                    window._splash.domNode.style.opacity = 0;
                    window._splash.domNode.style.zIndex = -99;
                }
                this.loadCharacter( charName, true );
            }
            else
            {
                this.splash.domNode.style.opacity = 1;
            }
        },
        logState : function( asJson )
        {
            if( asJson )
            {
                console.log( json.stringify( this.get( "state" ), false, 4 ) );
            }
            else
            {
                console.log( this.get( "state" ) );
            }
        },
        loadState : function()
        {
            this.set( "state", json.parse( window.localStorage._debugState ) );
        },
        newCharacter : function()
        {
            this.saveCharacter().then( lang.hitch( this, this.clear ));
        },
        loadCharacter : function( name, dontSave )
        {
            if( !dontSave )
            {
                this.saveCharacter().then( lang.hitch( this, this.doLoadCharacter, name ));
            }
            else
            {
                this.doLoadCharacter( name );
            }
        },
        doLoadCharacter : function( name )
        {
            CharacterStore.set( "character", name );
            this.set( "is_new", false );
            this.set( "juju", CharacterStore.get( "juju" ) || 0 );
            this.set( "state", CharacterStore.load( name ) );
        },
        isValidName : function( name )
        {
            return !CharacterStore.nameInUse( name );
        },
        saveCharacter : function()
        {
            return this.validateCharacter().then( lang.hitch( this, this.doSaveCharacter ) );
        },
        validateCharacter : function()
        {
            var reslts = [];
            for( var o in this.controls )
            {
                var reslt = this.controls[ o ].validate ? this.controls[ o ].validate() : { valid : true };
                if( reslt.valid != true )
                {
                    reslts.push( reslt.message );
                }
            }
            if( reslts.length > 0 )
            {
                util.alert( i18n.NotReadyToSave + "<ul><li>" + reslts.join( "</li><li>" ) + "</li></ul>" );
                return new Deferred().reject();
            }
            else
            {
                var juju = this.get( "juju" ) || 0;
                var diff = ( CharacterStore.get( "juju" ) || 0 ) - juju;
                if( this.is_new && juju > 0 )
                {
                    util.alert( i18n.YouHaveUnusedJuju );
                    return new Deferred().reject();
                }
                else if( diff == 0 || this.is_new )
                {
                    return new Deferred().resolve(); //( cName, juju );
                }
                else
                {
                    return util.confirm( string.substitute( i18n.ConfirmSpendJuju, { juju : diff } ) ); //.then( lang.hitch( this, this.doSaveCharacter ) )
                }
            }
        },
        doSaveCharacter : function()
        {
            var cName = this.controls.name.get( "state" ).characterName;
            var juju = this.get( "juju" );
            if( !this.is_new )
            {
                CharacterStore.set( "juju", juju );
            }
            this.set( "is_new", false );
            CharacterStore.save( cName, this.get( "state" ) );
            topic.publish( "/CharacterSaved/" );
            this.refreshEkip();
            return new Deferred().resolve();
        },
        deleteCharacter : function()
        {
            var charName = this.controls.name.get( "state" ).characterName;
            var keys = CharacterStore.list();
            if( charName && array.indexOf( keys, charName ) != -1 )
            {
                util.confirm( string.substitute( i18n.ConfirmDeleteCharacter, { charName : charName } ) ).then( lang.hitch( this, function()
                {
                    CharacterStore.remove( charName );
                    this.refreshEkip();
                    this.clear();
                }));
            }
            else
            {
                this.clear();
            }
        },
        revertCharacter : function()
        {
            if( this.controls.name.get( "state" ).characterName )
            {
                this.loadCharacter( this.controls.name.get( "state" ).characterName, true );
            }
        },
        getAllowedStunts : function()
        {
            var stunts = util.getProperties( this.controls.knacks.controls, {
                property : "complete",
                recurse : true,
                level : 1,
                filter : true
            });
            return stunts.length;
        },
        onJujuFocus : function()
        {
            setTimeout( lang.hitch( this.jujuInput.textbox, this.jujuInput.textbox.select ), 1 );
        },
        onJujuBlur : function()
        {
            if( this.jujuInput.isValid() && !this.is_new )
            {
                CharacterStore.set( "juju", this.jujuInput.get( "value" ) );
            }
        },
        onJujuChange : function()
        {
            this.publishJuju()
        },
        publishJuju : function()
        {
            var juju = this.jujuInput.get( "value" );
            topic.publish( "/StatChanged/-juju", juju );
        },
        refreshEkip : function()
        {
            this._ekipMenu.destroyDescendants();
            var keys = CharacterStore.list();
            for( var i = 0; i < keys.length; i++ )
            {
                this._ekipMenu.addChild( new MenuItem({
                    label: keys[ i ],
                    onClick: lang.hitch( this, this.loadCharacter, keys[ i ] )
                }));
            }
            this.ekipButton.set( "disabled", keys.length == 0 );
        },
        clear : function()
        {
            var pn = this.domNode.parentNode;
            CharacterStore.set( "character", false );
            this.splash.fadeIn();
            this.fadeOut();
            setTimeout( lang.hitch( this, function()
            {
                this.destroy();
                new Constr().placeAt( pn ).startup();
            }), 300);
        },
        resize : function()
        {
            this.inherited( arguments );
            if( domGeometry.getContentBox( this.domNode ).w < this.SMALL_THRESHOLD )
            {
                domClass.add( this.domNode, "br-compactLayout" );
            }
            else
            {
                domClass.remove( this.domNode, "br-compactLayout" );
            }
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
                for( var o in this.controls )
                {
                    out[ o ] = this.controls[ o ].get( "state" );
                }
                return out;
            }
            else if( array.indexOf( this.controls.numbers.get( "properties" ), prop ) != -1 )
            {
                return this.controls.numbers.get( prop );
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
            else if( prop == "is_new" )
            {
                this.is_new = val;
                if( val )
                {
                    domClass.add( this.domNode, "br-newCharacter" );
                }
                else
                {
                    domClass.remove( this.domNode, "br-newCharacter" );
                }
            }
            else if( prop == "state" )
            {
                this.loading = true;
                for( var o in this.controls )
                {
                    this.controls[ o ].set( "state", val[ o ] );
                }
                this.publishJuju();
                topic.publish( "/PleasePublishStatus/", true );
                setTimeout( lang.hitch( this, function() { this.loading = false }), 1 );
            }
            else
            {
                this.inherited( arguments );
            }
        },
        _addPane : function( point, pane )
        {
            this.controls[ point ] = pane;
            this.own( pane );
        }
    });
    return Constr;
});