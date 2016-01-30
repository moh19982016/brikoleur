/**
 * Base class for pulling up the UI and handling features common to the whole thing. Reset is done by destroying it
 * and recreating a new instance. When created, publishes itself as global Controller, which is referenced by sub-
 * widgets.
 *
 * @public Class
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dojo/_base/array",
          "dojo/json",
          "dojo/dom-class",
          "dojo/dom-geometry",
          "./controller/_Splash",
          "./oop/_OopPane",
          "./ip/_IpPane",
          "./controller/character-store",
          "./controller/CharacterStore",
          "./_base/util",
          "dijit/layout/LayoutContainer",
          "dijit/layout/TabContainer",
          "./_base/DynamicGrid",
          "dijit/layout/ContentPane",
          "dijit/form/NumberTextBox",
          "dijit/form/TextBox",
          "dijit/form/DropDownButton",
          "dijit/DropDownMenu",
          "dijit/MenuItem",
          "dijit/MenuSeparator",
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
          _OopPane,
          _IpPane,
          characterStore,
          CharacterStore,
          util,
          LayoutContainer,
          TabContainer,
          DynamicGrid,
          ContentPane,
          NumberTextBox,
          TextBox,
          DropDownButton,
          DropDownMenu,
          MenuItem,
          MenuSeparator,
          Button,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    var Constr = declare( [ LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin, characterStore ], {
        /**
         * Mode: "rest" or "play".
         *
         * @public string
         */
        mode : "rest",
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
        manualUrl : "http://manual.brikoleur.com/",
        /**
         * URL to licensing information.
         *
         * @final
         * @public string
         */
        licenseUrl : "http://shared.brikoleur.com/license.html",
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
            this.own( topic.subscribe( "/PleaseAutoSave/", lang.hitch( this, this.saveCharacter, true ) ) );
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
         * Toggles between play and rest modes (inPlayPane and characterPane).
         *
         * @public void
         */
        togglePlay : function()
        {
            if( this.mode == "rest" )
            {
                this.validateCharacter().then( lang.hitch( this, function()
                {
                    this.mode = "play";
                    this.playButton.set( "iconClass", "fa fa-beer" );
                    this.playButton.set( "label", i18n.PrepMode );
                    this.inPlayPane.set( "state", this.get( "state" ) );
                    this.mainTabs.selectChild( this.inPlayPane );
                } ) );
            }
            else
            {
                util.confirm( i18n.ReturnToBase ).then( lang.hitch( this, function()
                {
                    this.mode = "rest";
                    this.playButton.set( "iconClass", "fa fa-rocket" );
                    this.playButton.set( "label", i18n.PlayMode );
                    this.mainTabs.selectChild( this.characterPane );
                    domClass.remove( Controller.inPlayPane.domNode,
                    "br-status-wounded br-status-incapacitated br-status-dead" );
                    delete Controller.inPlayPane.characterStatus;
                } ) );
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
                domClass.add( document.body, "br-fullScreen" );
                // current working methods
                if( document.documentElement.requestFullscreen )
                {
                    document.documentElement.requestFullscreen();
                }
                else if( document.documentElement.msRequestFullscreen )
                {
                    document.documentElement.msRequestFullscreen();
                }
                else if( document.documentElement.mozRequestFullScreen )
                {
                    document.documentElement.mozRequestFullScreen();
                }
                else if( document.documentElement.webkitRequestFullscreen )
                {
                    document.documentElement.webkitRequestFullscreen( Element.ALLOW_KEYBOARD_INPUT );
                }
            }
            else
            {
                domClass.remove( document.body, "br-fullScreen" );
                if( document.exitFullscreen )
                {
                    document.exitFullscreen();
                }
                else if( document.msExitFullscreen )
                {
                    document.msExitFullscreen();
                }
                else if( document.mozCancelFullScreen )
                {
                    document.mozCancelFullScreen();
                }
                else if( document.webkitExitFullscreen )
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
            } ), 1 );
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
            } ), 1 );
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
            else if( array.indexOf( this.characterPane.panes.numbers.get( "properties" ), prop ) != -1 )
            {
                return this.characterPane.panes.numbers.get( prop );
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
         * Clears ._ekipMenu and recreates it from CharacterStore.list().
         *
         * @public void
         */
        refreshEkip : function()
        {
            this._ekipMenu.destroyDescendants();
            this._ekipMenu.addChild( new MenuItem( {
                iconClass : "fa fa-sun-o br-gold",
                label : i18n.NewCharacter,
                onClick : lang.hitch( this, this.newCharacter )
            } ) );
            var keys = CharacterStore.list();
            if( keys.length > 0 )
            {
                this._ekipMenu.addChild( new MenuSeparator() );
            }
            for( var i = 0; i < keys.length; i++ )
            {
                this._ekipMenu.addChild( new MenuItem( {
                    label : keys[ i ],
                    onClick : lang.hitch( this, this.loadCharacter, keys[ i ] )
                } ) );
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
            this.splash.resize( true );
            this.splash.fadeIn();
            this.fadeOut();
            setTimeout( lang.hitch( this, function()
            {
                this.destroy();
                new Constr().placeAt( pn ).startup();
            } ), 300 );
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
            this.splash = window._splash || new _Splash( { style : "opacity:0" } ).placeAt( document.body );
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
            this.playButton = new Button( {
                label : i18n.PlayMode,
                "class" : "br-headerButton br-darkButton",
                iconClass : "fa fa-rocket",
                onClick : lang.hitch( this, this.togglePlay )
            } ).placeAt( this.headerContentNode, "first" );
            this.playButton.startup();
            this._toolsMenu = new DropDownMenu();
            this._toolsMenu.addChild( new MenuItem( {
                label : i18n.Download,
                onClick : lang.hitch( this, this.downloadCharacters )
            } ) );
            this._toolsMenu.addChild( new MenuItem( {
                label : i18n.Upload,
                onClick : lang.hitch( this, this.uploadCharacters )
            } ) );
            //this._toolsMenu.addChild( new MenuItem({ label : i18n.SetUpSync, onClick : lang.hitch( this, this.setUpSync ) } ) );
            this._toolsMenu.addChild( new MenuItem( {
                label : i18n.Print,
                onClick : lang.hitch( this, this.printCharacter )
            } ) );
            this._toolsMenu.startup();
            this.toolsButton = new DropDownButton( {
                dropDown : this._toolsMenu,
                label : i18n.Tools,
                "class" : "br-headerButton br-darkButton",
                iconClass : "fa fa-wrench"
            } ).placeAt( this.headerContentNode, "first" );
            this.toolsButton.startup();
            this._ekipMenu = new DropDownMenu();
            this._ekipMenu.startup();
            this.ekipButton = new DropDownButton( {
                dropDown : this._ekipMenu,
                label : i18n.Ekip,
                "class" : "br-headerButton br-darkButton",
                iconClass : "fa fa-users"
            } ).placeAt( this.headerContentNode, "first" );
            this.ekipButton.startup();
            if( this._hasFullScreen() )
            {
                this.own( new Button( {
                    label : "",
                    "class" : "br-headerButton br-darkButton br-compactButton br-fullScreenButton",
                    iconClass : "fa fa-arrows",
                    onClick : lang.hitch( this, this.toggleFullScreen )
                } ).placeAt( this.leftHeaderNode, "first" ) );
            }
            this.refreshEkip();
            this.own( this.playButton, this._ekipMenu, this.ekipButton, this._toolsMenu, this.toolsButton );
        },
        /**
         * Adds all the UI panes needed for the character creator.
         *
         * @private void
         */
        _setupPanes : function()
        {
            this.characterPane = new _OopPane( { manager : this } ).placeAt( this.mainTabs );
            this.inPlayPane = new _IpPane( { manager : this } ).placeAt( this.mainTabs );
            this.characterPane.startup();
            this.inPlayPane.startup();
            this.own( this.characterPane, this.inPlayPane );
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
         * Iterates through panes and returns their states as keywordObject, keyed to their attachPoint.
         *
         * @private Object
         */
        _getState : function()
        {
            return this.characterPane.get( "state" );
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
            if( state.type == "template" )
            {
                this.loadingTemplate = true;
            }
            this.characterPane.set( "state", state );
            this.publishJuju();
            setTimeout( lang.hitch( this, function()
            {
                this.loading = false;
                this.loadingTemplate = false;
                this.mainTabs.selectChild( this.characterPane );
            } ), 1 ); // Do we need the timeout?
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
         * Sniffs for fullscreen support, returns result as boolean.
         *
         * @private boolean
         */
        _hasFullScreen : function()
        {
            return !!( document.exitFullscreen ||
                       document.msExitFullscreen ||
                       document.mozCancelFullScreen ||
                       document.webkitExitFullscreen );
        }
    } );
    return Constr;
} );