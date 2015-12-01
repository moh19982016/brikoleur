/**
 * Splash screen. Lets user pick an archetype and give a name, then opens Controller preloaded with settings from them.
 * Also hides messy destroy and recreate of Controller when resetting it.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/on",
         "dojo/dom-geometry",
         "dojo/dom-style",
         "dojo/store/Memory",
         "dijit/form/TextBox",
         "dijit/form/Select",
         "./../_base/util",
         "./../data/archetypes",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!./templates/_Splash.html",
         "dojo/i18n!./../../nls/CharGen" ],
function( declare,
          lang,
          on,
          domGeometry,
          domStyle,
          Memory,
          TextBox,
          Select,
          util,
          archetypes,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
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
         * Reference scale for dynamically scaling layout. Smaller numbers yield larger magnifications.
         *
         * @final
         * @public int
         */
        refWidth : 1200,
        /**
         * Controller to which to fade to once we're done.
         *
         * @public Controller
         */
        manager : {},
        /**
         * Label for custom choice.
         *
         * @final
         * @public string
         */
        CUSTOM_CHOICE : "I make my own choices",
        /**
         * Setup scaling and UI controls, with events connected to them.
         *
         * @public void
         */
        postCreate : function()
        {
            this.domNode.style.opacity = 0;
            this.domNode.style.display = "block";
            var tf = "scale(50)";
            domStyle.set( this.logoNode, {
                transform : tf,
                "-webkit-transform" : tf
            });
            this.own( on( window, "resize", lang.hitch( this, this.resize ) ) );
            this._store =  new Memory({ data : util.listToStoreData( archetypes.list ), getLabel : function( item ) { return item.name } } );
            this.nameInput = new TextBox({ "class" : "br-splashCharacterInput", placeholder : i18n.CharacterName } ).placeAt( this.nameInputNode );
            this.archetypeSelect = new Select({ "class" : "br-splashArchetypeSelect", store : this._store }).placeAt( this.archetypeSelectNode );
            this.own( on( this.nameInput, "click", function( evt )
            {
                evt.stopPropagation();
            }), this._store, this.nameInput, this.archetypeSelect );
            setTimeout( lang.hitch( this.nameInput, this.nameInput.focus ), 1 );
            setTimeout( lang.hitch( this, this.fadeIn ), 10 );
        },
        /**
         * If val is something other than CUSTOM_CHOICE, load it into Controller. In any case, .close.
         *
         * @public void
         */
        createCharacter : function()
        {
            var val = this.archetypeSelect.get( "value" );
            if( val != this.CUSTOM_CHOICE )
            {
                this.manager.set( "state", lang.mixin( this._store.get( val ).data, { name : { is_template : true, characterName : this.nameInput.get( "value" ) } } ) );
            }
            this.close();
        },
        /**
         * Call .resize, then clear .nameInput, and fade in .domNode. Also set an on.once listener on document body to
         * close.
         *
         * @public void
         */
        fadeIn : function()
        {
            this.resize();
            this.nameInput.set( "value", "" );
            setTimeout( lang.hitch( this, function()
            {
                this.domNode.style.opacity = 1;
                this.domNode.style.zIndex = "999";
                this.own( on.once( document.body, "click", lang.hitch( this, this.close ) ) );
            }), 1 );
        },
        /**
         * Fade out domNode and send it waaay back.
         *
         * @public void
         */
        fadeOut : function()
        {
            this.domNode.style.opacity = 0;
            setTimeout( lang.hitch( this, function() {
                this.domNode.style.zIndex = "-999";
            }), 300 );
        },
        /**
         * If instant, just set domNode display to none and close. Else fadeIn manager and .fadeOut self.
         *
         * @param instant
         */
        close : function( /* boolean */ instant )
        {
            if( instant )
            {
                this.domNode.style.display = "none";
                this.close();
                setTimeout( lang.hitch( this, function() {
                    this.domNode.style.display = "block";
                }), 500 );
            }
            else
            {
                this.manager.fadeIn();
                this.fadeOut();
            }
        },
        /**
         * Recalculate size of dom geometry to fit screen... more or less. We're a little artistic here on purpose.
         *
         * @public void
         */
        resize : function()
        {
            if( this.domNode.style.opacity == 1 )
            {
                var box = domGeometry.getContentBox( document.body );
                var tf = "scale(" + ( ( box.w + box.h ) / ( 2 * this.refWidth ) ) + ")";
                domStyle.set( this.logoNode, {
                    transform : tf,
                    "-webkit-transform" : tf,
                    top : ( box.h + box.w ) * ( box.h / box.w ) * 0.1 + 300 * box.w/this.refWidth + "px"
                });
            }
        }
    });
});