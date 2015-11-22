/**
 * Base for main character utility pane (out of play, in-play...)
 *
 * @public Base
 */
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
         * Adds all the UI panes needed for the character creator.
         *
         * @public void
         */
        startup : function()
        {
            if( this._started )
            {
                return;
            }
            this.panes = {};
            this.inherited( arguments );
            this.setupPanes();
        },
        /**
         * Stub. Add the panes you want here.
         *
         * @stub
         * @public void
         */
        setupPanes : function()
        {
        },
        /**
         * Intercept "state" to _setState.
         *
         * @param prop
         * @param val
         * @public void
         */
        set : function( /* string */ prop, /* {*} */ val )
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
        /**
         * Intercept "state" to _getState.
         *
         * @param prop
         * @public {*}
         */
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