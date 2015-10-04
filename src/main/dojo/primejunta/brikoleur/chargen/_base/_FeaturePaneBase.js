/**
 * Base for feature panes placed in _DynamicGrid.
 *
 * @public Base
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/_base/array",
         "dojo/topic",
         "dojo/dom-class",
         "dojo/dom-construct",
         "dojo/dom-geometry",
         "./_DockButton",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojo/text!./templates/_FeaturePaneBase.html" ],
function( declare,
          lang,
          array,
          topic,
          domClass,
          domConstruct,
          domGeometry,
          _DockButton,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare([ _WidgetBase, _TemplatedMixin ], {
        /**
         * Pane title.
         *
         * @final
         * @public string
         */
        title : "",
        /**
         * Pane icon.
         *
         * @final
         * @public string
         */
        icon : "",
        /**
         * Dock node.
         *
         * @final
         * @public Element
         */
        dock : {},
        /**
         * Duration for expand/contract animation..
         *
         * @final
         * @public int
         */
        animDuration : 300,
        /**
         * Pane title.
         *
         * @final
         * @public string
         */
        minimized : false,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then set up internal properties, dock button, and initial state.
         * 
         * @public void
         */
        buildRendering : function()
        {
            this.inherited( arguments );
            this.controls = [];
            this._props = {};
            this._button = new _DockButton({ pane : this }).placeAt( this.dock );
            this.own( this._button, topic.subscribe( "/PleasePublishStatus/", lang.hitch( this, this.publishStatus ) ) );
            if( this.minimized )
            {
                this.domNode.style.display = "none";
                this._button.domNode.style.display = "none";
                domClass.remove( this._button.domNode, "br-dockIconMaximized" );
            }
        },
        /**
         * Create a widget with constr in attach point prop, with properties props, placed at refNode, at position
         * position.
         * 
         * @param prop
         * @param constr
         * @param props
         * @param refNode
         * @param position
         */
        addField : function( prop, constr, props, refNode, position )
        {
            props.name = prop;
            this._props[ prop ] = new constr( props ).placeAt( refNode || this.containerNode, position || "last" );
            this.controls.push( this._props[ prop ] );
        },
        /**
         * Set .minimized, then ._move from where I am to ._button, and remove CSS class for maximized pane from button.
         *
         * @public void
         */
        minimize : function()
        {
            this.minimized = true;
            this._move( domGeometry.position( this.domNode ), domGeometry.position( this._button.domNode ), true );
            domClass.remove( this._button.domNode, "br-dockIconMaximized" );
        },
        /**
         * Unset .minimized, then ._move from ._button location to my usual spot, set display to "block" on both domNode
         * and ._button, and addCSS class for maximized pane to button.
         *
         * @public void
         */
        maximize : function()
        {
            this.minimized = false;
            this.domNode.style.display = "block";
            this._button.domNode.style.display = "block";
            this._move( domGeometry.position( this._button.domNode ), domGeometry.position( this.domNode ), false );
            domClass.add( this._button.domNode, "br-dockIconMaximized" );
        },
        /**
         * Scroll into view and .flash().
         *
         * @public void
         */
        focus : function()
        {
            this.domNode.scrollIntoView( true );
            this.flash();
        },
        /**
         * Call .highLight(), then unHighLight() after .animDuration.
         *
         * @public void
         */
        flash : function()
        {
            this.highLight();
            setTimeout( lang.hitch( this, this.unHighLight ), this.animDuration );
        },
        /**
         * Add "highlighted" CSS class.
         *
         * @public void
         */
        highLight : function()
        {
            domClass.add( this.domNode, "br-paneHighlighted" );
        },
        /**
         * Remove "highlighted" CSS class.
         *
         * @public void
         */
        unHighLight : function()
        {
            domClass.remove( this.domNode, "br-paneHighlighted" );
        },
        /**
         * Stub. Connect to this to publish status of whatever's in the pane.
         *
         * @stub
         * @public void
         */
        publishStatus : function()
        {
        },
        /**
         * Remove item from .controls.
         *
         * @param item
         * @public void
         */
        pleaseRemove : function( /* Object */ item )
        {
            this.controls.splice( array.indexOf( this.controls, item ), 1 );
        },
        /**
         * Intercept "properties", "state", by returning keys of this._props, ._getState(), or the value
         * of the control matching prop if it's present in ._props, else inherited.
         *
         * @param prop
         * @public {*}
         */
        get : function( /* string */ prop )
        {
            if( prop == "properties" )
            {
                return Object.keys( this._props );
            }
            else if( prop == "state" )
            {
                return this._getState();
            }
            else if( this._props[ prop ] )
            {
                return this._props[ prop ].get( "value" );
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        /**
         * Set prop, val on control from ._props if present; else if prop is "state", ._setState. Else inherited.
         *
         * @param prop
         * @param val
         * @public void
         */
        set : function( /* string */ prop, /* {*} */ val )
        {
            if( this._props[ prop ] )
            {
                this._props[ prop ].set( "value", val );
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
         * Pops to destroy all .controls.
         *
         * @public void
         */
        clear : function()
        {
            while( this.controls.length > 0 )
            {
                this.controls.pop().destroy();
            }
        },
        /**
         * Plays zoom animation from node from, to node to. If hide is set, sets display of self to "none" after
         * animation completes.
         *
         * @param from
         * @param to
         * @param hide
         * @private void
         */
        _move : function( /* Element */ from, /* Element */ to, /* boolean */ hide )
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
        /**
         * Sets position of node to coords using direct manipulation of .style, because we don't want the normalized
         * coordinates domGeometry uses.
         *
         * @param node
         * @param coords
         * @private void
         */
        _setPos : function( /* Element */ node, /* Object */ coords )
        {
            node.style.left = coords.x + "px";
            node.style.top = coords.y + "px";
            node.style.width = coords.w + "px";
            node.style.height = coords.h + "px";
        },
        /**
         * Returns states of controls as Object[].
         *
         * @private Object[]
         */
        _getState : function()
        {
            var out = [];
            for( var i = 0; i < this.controls.length; i++ )
            {
                out.push( this.controls[ i ].get( "state" ) );
            }
            return out;
        },
        /**
         * Sets states of controls from Object[].
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object[] */ state )
        {
            for( var i = 0; i < this.controls.length; i++ )
            {
                this.controls[ i ].set( "state", state[ i ] );
            }
        }
    });
});