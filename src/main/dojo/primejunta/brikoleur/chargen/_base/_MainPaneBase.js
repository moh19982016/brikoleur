define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dijit/layout/ContentPane",
          "./DynamicGrid",
          "dijit/layout/LayoutContainer",
          "dijit/_TemplatedMixin",
          "dijit/_WidgetsInTemplateMixin",
          "dojo/text!./templates/_MainPaneBase.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          ContentPane,
          DynamicGrid,
          LayoutContainer,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare( [ LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        dict : i18n,
        panes : {},
        templateString : template,
        set : function( prop, val )
        {
            if( prop == "state" )
            {
                this._setState( val );
            }
            else
            {
                this.inherited( arguments );
            }
        },
        get : function( prop )
        {
            if( prop == "state" )
            {
                return this._getState();
            }
            else
            {
                return this.inherited( arguments );
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
         * Iterates through state, and sets the state of each pane from the corresponding property in it. Then publishes
         * topic to request info from all controls, which will update the filters on data stores and cause other
         * cross-dependencies to get set up like they should. Finally unsets loading flag.
         *
         * @param state
         * @private void
         */
        _setState : function( state )
        {
            for( var o in this.panes )
            {
                this.panes[ o ].set( "state", state[ o ] );
            }
            topic.publish( "/PleasePublishInfo/", true );
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
        }
    } );
} );