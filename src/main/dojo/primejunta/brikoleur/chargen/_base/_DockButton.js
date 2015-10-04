/**
 * Internal widget belonging to _FeaturePaneBase. It's a button that's put in a dock which you can use to scroll to
 * the pane or maximize it if it's minimized.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/on",
         "dojo/dom-construct",
         "dojo/dom-class",
         "dijit/_WidgetBase" ],
function( declare,
          lang,
          on,
          domConstruct,
          domClass,
          _WidgetBase )
{
    return declare([ _WidgetBase ], {
        /**
         * The pane to which it belongs.
         *
         * @public _FeaturePaneBase
         */
        pane : {},
        /**
         * Inherited, then create an icon in domNode, and own a bunch of event handlers for it.
         *
         * @public void
         */
        buildRendering : function()
        {
            this.inherited( arguments );
            domConstruct.create( "i", { "class" : "fa fa-" + this.pane.icon }, this.domNode );
            domClass.add( this.domNode, "br-dockIcon br-dockIconMaximized" );
            this.own( on( this.domNode, "click", lang.hitch( this, this.showPane ) ) );
            this.own( on( this.domNode, "mouseover", lang.hitch( this.pane, this.pane.highLight ) ) );
            this.own( on( this.domNode, "mouseout", lang.hitch( this.pane, this.pane.unHighLight ) ) );
        },
        /**
         * If the pane is minimized, .maximize it. Else .focus it.
         *
         * @public void
         */
        showPane : function()
        {
            if( this.pane.minimized )
            {
                this.pane.maximize( this );
            }
            else
            {
                this.pane.focus( this );
            }
        }
    });
});