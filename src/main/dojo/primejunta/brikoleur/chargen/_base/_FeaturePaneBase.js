define([ "dojo/_base/declare",
         "dojo/_base/lang",
        "dojo/topic",
         "dojo/on",
         "dojo/dom-class",
         "dojo/dom-construct",
         "dojo/dom-geometry",
         "./_DockButton",
         "dijit/_WidgetBase" ],
function( declare,
          lang,
          topic,
          on,
          domClass,
          domConstruct,
          domGeometry,
          _DockButton,
          _WidgetBase )
{
    return declare([ _WidgetBase ], {
        title : "",
        icon : "",
        dock : {},
        animDuration : 300,
        container : {},
        minimized : false,
        buildRendering : function()
        {
            this.inherited( arguments );
            this._props = {};
            domClass.add( this.domNode, "br-featurePane" );
            var tNode = domConstruct.create( "div", { "class" : "br-featureTitle", innerHTML : "<div><i class=\"fa fa-" + this.icon + "\"></i>&nbsp;&nbsp;" + this.title + "</div>" }, this.domNode, "first" )
            var mNode = domConstruct.create( "i", { "class" : "br-minimizeButton fa fa-minus-circle" }, tNode, "first" );
            this.containerNode = domConstruct.create( "div", { "class" : "br-featureContainer" }, this.domNode );
            this.own( on( tNode, "click", lang.hitch( this, this.minimize ) ) );
            this._button = new _DockButton({ pane : this }).placeAt( this.dock );
            if( this.minimized )
            {
                this.domNode.style.display = "none";
                domClass.remove( this._button.domNode, "br-dockIconMaximized" );
            }
        },
        addField : function( prop, field )
        {
            this._props[ prop ] = field;
            field.placeAt( this.containerNode );
        },
        minimize : function()
        {
            this.minimized = true;
            this._move( domGeometry.position( this.domNode ), domGeometry.position( this._button.domNode ), true );
            domClass.remove( this._button.domNode, "br-dockIconMaximized" );
        },
        maximize : function()
        {
            this.minimized = false;
            this.domNode.style.display = "block";
            this._move( domGeometry.position( this._button.domNode ), domGeometry.position( this.domNode ), false );
            domClass.add( this._button.domNode, "br-dockIconMaximized" );
        },
        focus : function()
        {
            this.domNode.scrollIntoView( true );
            this.flash();
        },
        flash : function()
        {
            this.highLight();
            setTimeout( lang.hitch( this, this.unHighLight ), this.animDuration );
        },
        highLight : function()
        {
            domClass.add( this.domNode, "br-flashPane" );
        },
        unHighLight : function()
        {
            domClass.remove( this.domNode, "br-flashPane" );
        },
        get : function( prop )
        {
            if( this._props[ prop ] )
            {
                return this._props[ prop ].get( "value" );
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        set : function( prop, val )
        {
            if( this._props[ prop ] )
            {
                this._props[ prop ].set( "value", val );
            }
            else
            {
                this.inherited( arguments );
            }
        },
        _move : function( from, to, hide )
        {
            var zoomer = domConstruct.create( "div", { "class" : "br-zoomer" }, document.body );
            this.domNode.style.visibility = "hidden";
            if( !hide )
            {
                this.domNode.style.display = "block";
            }
            this._setPos( zoomer, from );
            domGeometry.setMarginBox( zoomer, from );
            this._setPos( zoomer, to );
            setTimeout( lang.hitch( this, function()
            {
                domConstruct.destroy( zoomer );
                if( hide )
                {
                    this.domNode.style.display = "none";
                }
                this.domNode.style.visibility = "visible";
                topic.publish( "/PaneToggled/", this, hide );
            }), this.animDuration );
        },
        _setPos : function( node, coords )
        {
            node.style.left = coords.x + "px";
            node.style.top = coords.y + "px";
            node.style.width = coords.w + "px";
            node.style.height = coords.h + "px";
        }
    });
});