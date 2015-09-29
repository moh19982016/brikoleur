define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dom-geometry",
        "dojo/dom-style",
        "dojo/store/Memory",
        "dijit/form/TextBox",
        "dijit/form/Button",
        "dijit/form/Select",
        "./oop/_base/util",
        "./data/archetypes",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/_Splash.html",
        "dojo/i18n!./../nls/CharGen" ],
function( declare,
          lang,
          on,
          domGeometry,
          domStyle,
          Memory,
          TextBox,
          Button,
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
        dict : i18n,
        templateString : template,
        refWidth : 1200,
        manager : {},
        postCreate : function()
        {
            this.domNode.style.opacity = 1;
            this.own( on( window, "resize", lang.hitch( this, this.resize ) ) );
            this._store =  new Memory({ data : util.listToStoreData( archetypes.list ), getLabel : function( item ) { return item.name } } );
            this.nameInput = new TextBox({ "class" : "br-splashCharacterInput", placeholder : i18n.CharacterName } ).placeAt( this.nameInputNode );
            this.archetypeSelect = new Select({ "class" : "br-splashArchetypeSelect", store : this._store }).placeAt( this.archetypeSelectNode );
            setTimeout( lang.hitch( this.nameInput, this.nameInput.focus ), 1 );
            this.resize();
        },
        createCharacter : function()
        {
            this.manager.set( "state", lang.mixin( this._store.get( this.archetypeSelect.get( "value" ) ).data, { name : { is_template : true, characterName : this.nameInput.get( "value" ) } } ) );
            this.manager.fadeIn();
            this.fadeOut();
        },
        fadeIn : function()
        {
            this.nameInput.set( "value", "" );
            this.domNode.style.display = "block";
            setTimeout( lang.hitch( this, function()
            {
                this.domNode.style.opacity = 1;
                this.domNode.style.zIndex = "999";
            }), 1 );
        },
        fadeOut : function()
        {
            this.domNode.style.opacity = 0;
            setTimeout( lang.hitch( this, function() {
                this.domNode.style.zIndex = "-999";
            }), 300 );
        },
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