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
        pane : {},
        buildRendering : function()
        {
            this.inherited( arguments );
            domConstruct.create( "i", { "class" : "fa fa-" + this.pane.icon }, this.domNode );
            domClass.add( this.domNode, "br-dockIcon br-dockIconMaximized" );
            this.own( on( this.domNode, "click", lang.hitch( this, this.showPane ) ) );
            this.own( on( this.domNode, "mouseover", lang.hitch( this.pane, this.pane.highLight ) ) );
            this.own( on( this.domNode, "mouseout", lang.hitch( this.pane, this.pane.unHighLight ) ) );
        },
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