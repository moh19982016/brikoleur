/**
 * Base class for pulling up the UI and handling features common to the whole thing. Reset is done by destroying it
 * and recreating a new instance. When created, publishes itself as global Controller, which is referenced by sub-
 * widgets.
 *
 * @public Class
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dojo/_base/array",
         "dojo/json",
         "dojo/dom-class",
         "dojo/dom-geometry",
         "./controller/_Splash",
         "./oop/_base/util",
         "./oop/name/NamePane",
         "./oop/description/DescriptionPane",
         "./oop/gear/InventoryPane",
         "./oop/knacks/KnacksPane",
         "./oop/numbers/NumbersPane",
         "./oop/traits/TraitsPane",
         "./oop/powers/PowersPane",
         "./oop/stunts/StuntsPane",
         "./oop/ohun/OhunPane",
         "./controller/_character-store",
         "./controller/CharacterStore",
         "dijit/layout/LayoutContainer",
         "dijit/layout/TabContainer",
         "./_base/DynamicGrid",
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
          domGeometry,
          _Splash,
          util,
          NamePane,
          DescriptionPane,
          InventoryPane,
          KnacksPane,
          NumbersPane,
          TraitsPane,
          PowersPane,
          StuntsPane,
          OhunPane,
          _characterStore,
          CharacterStore,
          LayoutContainer,
          TabContainer,
          DynamicGrid,
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
    var Constr = declare([ LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin, _characterStore  ], {
        /**
         * Threshold width at which domNode will be tagged with class modifying layout to small-screen.
         *
         * @final
         * @public int
         */
        SMALL_THRESHOLD : 650,
        /**
         * Map of panes created by the Controller.
         *
         * @public Object
         */
        panes : {},
        /**
         * URL for links to user manual.
         *
         * @final
         * @public string
         */
        manualUrl : "http://www.brikoleur.com/manual/index.html",
        /**
         * URL to licensing information.
         *
         * @final
         * @public string
         */
        licenseUrl : "http://www.brikoleur.com/license/",
        /**
         * Localization.
         *
         * @final
         * @public Object
         */
        dict : i18n,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Publish self as window.Controller. Then ._setupInitialState, ._setupButtons, ._setupPanes, and
         * ._loadSettings.
         *
         * @public void
         */
        postCreate : function()
        {
            window.Controller = this;
            this._setupInitialState();
            this._setupButtons();
            this._setupPanes();
            this._loadSettings();
        },
        /**
         * Since the number of allowed stunts depends on the number of combat training slots the character has used,
         * we need to go through the Controller to determine that. The StuntsPane uses this method.
         *
         * @public int
         */
        getAllowedStunts : function()
        {
            var stunts = util.getProperties( this.panes.knacks.controls, {
                property : "complete",
                recurse : true,
                level : 1,
                filter : true
            });
            return stunts.length;
        },
        /**
         * Method used for development and debug purposes: logs state of UI as Object or JSON string.
         *
         * @param asJson
         * @public void
         */
        logState : function( /* boolean */ asJson )
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
        /**
         * Toggles fullscreen. Verbose method because lots of vendor prefixes are required.
         *
         * @public void
         */
        toggleFullScreen : function()
        {
            if( !document.fullscreenElement &&
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
        /**
         * Fades in this.domNode. Behind a timeout to allow other directives to clear first.
         *
         * @public void
         */
        fadeIn : function()
        {
            setTimeout( lang.hitch( this, function()
            {
                this.domNode.style.opacity = 1;
            }), 1 );
        },
        /**
         * Fades out this.domNode. Behind a timeout to allow other directives to clear first.
         *
         * @public void
         */
        fadeOut : function()
        {
            setTimeout( lang.hitch( this, function()
            {
                this.domNode.style.opacity = 0;
            }), 1 );
        },
        /**
         * Inherited, then check width and add/remove compactLayout CSS class if necessary.
         *
         * @public void
         */
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
        /**
         * Fires when juju field is focused: selects its content.
         *
         * @public void
         */
        onJujuFocus : function()
        {
            setTimeout( lang.hitch( this.jujuInput.textbox, this.jujuInput.textbox.select ), 1 );
        },
        /**
         * Fires when juju field is blurred: saves its content to settings store, unless it's invalid or we're making
         * a new character.
         *
         * @public void
         */
        onJujuBlur : function()
        {
            if( this.jujuInput.isValid() && !this.is_new )
            {
                CharacterStore.set( "juju", this.jujuInput.get( "value" ) );
            }
        },
        /**
         * When juju changes, publish the change.
         *
         * @public void
         */
        onJujuChange : function()
        {
            this.publishJuju()
        },
        /**
         * Publish juju with standard /StatChanged/-juju topic. Panes which calculate juju costs will be listening.
         *
         * @public void
         */
        publishJuju : function()
        {
            topic.publish( "/StatChanged/-juju", this.jujuInput.get( "value" ) );
        },
        /**
         * Intercept "juju", "state", and any prop matching something in the numbers pane. Else inherited.
         *
         * @param prop
         * @public {*}
         */
        get : function( /* string */ prop )
        {
            if( prop == "juju" )
            {
                return this.jujuInput.get( "value" );
            }
            else if( prop == "state" )
            {
                return this._getState();
            }
            else if( array.indexOf( this.panes.numbers.get( "properties" ), prop ) != -1 )
            {
                return this.panes.numbers.get( prop );
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        /**
         * Intercept "juju", "is_new", and "state", else inherited.
         * 
         * @param prop
         * @param val
         */
        set : function( prop, val )
        {
            if( prop == "juju" )
            {
                this.jujuInput.set( "value", val );
            }
            else if( prop == "is_new" )
            {
                this._setIsNew( val );
            }
            else if( prop == "state" )
            {
                this._setState( val );
            }
            else
            {
                this.inherited( arguments );
            }
        },
        /**
         * Removes domNode from its parent, fades in splash screen, and sets a timeout to destroy self and create a new
         * instance at its original spot after animation has completed.
         *
         * @public void
         */
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
        /**
         * Add class to document.body indicating that loading has completed, and set "is_new" to true. Then create or
         * get pointer to splash screen and update its .manager property to point to this.
         *
         * @private void
         */
        _setupInitialState : function()
        {
            domClass.add( document.body, "br-hasLoaded" );
            this.set( "is_new", true );
            this.splash = window._splash || new _Splash({ style : "opacity:0" } ).placeAt( document.body );
            window._splash = this.splash;
            this.splash.manager = this;
        },
        /**
         * Add a fullscreen button if supported, a button for creating new characters, and a DropDownButton for
         * selecting existing ones.
         *
         * @private ovid
         */
        _setupButtons : function()
        {
            if( this._hasFullScreen() )
            {
                this.own( new Button({ label : "", "class" : "br-headerButton br-darkButton br-floatRight br-compactButton", iconClass : "fa fa-arrows", onClick : lang.hitch( this, this.toggleFullScreen) } ).placeAt( this.headerContentNodeRight, "first" ) );
            }
            this.newCharacterButton = new Button({ label : i18n.NewCharacter, "class" : "br-headerButton br-darkButton", iconClass : "fa fa-sun-o br-gold", onClick : lang.hitch( this, this.newCharacter) } ).placeAt( this.headerContentNode, "first" );
            this._ekipMenu = new DropDownMenu();
            this._ekipMenu.startup();
            this.ekipButton = new DropDownButton({ dropDown : this._ekipMenu, label : i18n.Ekip, "class" : "br-headerButton br-darkButton", iconClass : "fa fa-users" } ).placeAt( this.headerContentNode, "first" );
            this.ekipButton.startup();
            this._refreshEkip();
            this.own( this._ekipMenu, this.ekipButton, this.newCharacterButton );
        },
        /**
         * Adds all the UI panes needed for the character creator.
         *
         * @private void
         */
        _setupPanes : function()
        {
            this._addPane( "name", new NamePane().placeAt( this.nameContainer ) );
            this._addPane( "traits", new TraitsPane({ dock : this.dockContainer }).placeAt( this.oopGrid ) );
            this._addPane( "knacks", new KnacksPane({ dock : this.dockContainer }).placeAt( this.oopGrid ) );
            this._addPane( "numbers", new NumbersPane({ dock : this.dockContainer }).placeAt( this.oopGrid ) );
            this._addPane( "powers", new PowersPane({ minimized : true, dock : this.dockContainer }).placeAt( this.oopGrid ) );
            this._addPane( "ohun", new OhunPane({ dock : this.dockContainer }).placeAt( this.oopGrid ) );
            this._addPane( "stunts", new StuntsPane({ minimized : true, dock : this.dockContainer }).placeAt( this.oopGrid ) );
            this._addPane( "gear", new InventoryPane({ dock : this.dockContainer }).placeAt( this.oopGrid ) );
            this._addPane( "description", new DescriptionPane({ dock : this.dockContainer }).placeAt( this.oopGrid ) );
        },
        /**
         * Checks if we want to load straight into a character, and does so if necessary; else fades in splash screen.
         *
         * @private void
         */
        _loadSettings : function()
        {
            var charName = CharacterStore.get( "character" );
            if( charName && array.indexOf( CharacterStore.list(), charName ) != -1 )
            {
                this.loadCharacter( charName, true );
                this.splash.close();
            }
            else
            {
                this.splash.domNode.style.opacity = 1;
            }
        },
        /**
         * Adds pane pane at .panes[ point ], and owns it.
         *
         * @param point
         * @param pane
         * @private void
         */
        _addPane : function( /* string */ point, /* _FeaturePaneBase */ pane )
        {
            this.panes[ point ] = pane;
            this.own( pane );
        },
        /**
         * Iterates through panes and returns their states as keywordObject, keyed to their attachPoint.
         *
         * @private Object
         */
        _getState : function()
        {
            var out = {};
            for( var o in this.panes )
            {
                out[ o ] = this.panes[ o ].get( "state" );
            }
            return out;
        },
        /**
         * Iterates through state, and sets the state of each pane from the corresponding property in it. Then publishes
         * topic to request info from all controls, which will update the filters on data stores and cause other
         * cross-dependencies to get set up like they should. Finally unsets loading flag.
         *
         * @param state
         * @private void
         */
        _setState : function( state )
        {
            this.loading = true;
            for( var o in this.panes )
            {
                this.panes[ o ].set( "state", state[ o ] );
            }
            this.publishJuju();
            topic.publish( "/PleasePublishInfo/", true );
            setTimeout( lang.hitch( this, function() { this.loading = false }), 1 ); // Do we need the timeout?
        },
        /**
         * Sets is_new to val, and adds/removes a domClass to match.
         *
         * @param val
         * @private void
         */
        _setIsNew : function( /* boolean */ val )
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
        },
        /**
         * Clears ._ekipMenu and recreates it from CharacterStore.list().
         *
         * @private void
         */
        _refreshEkip : function()
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
        /**
         * Sniffs for fullscreen support, returns result as boolean.
         *
         * @private boolean
         */
        _hasFullScreen : function()
        {
            return !!( document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen );
        }
    });
    return Constr;
});