/**
 * Subpane containing feature info: a particular type of trait, ohun or power, for example.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/_base/array",
         "dojo/topic",
         "./_ControlPaneMixin",
         "./_DescriptionMixin",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojo/text!./templates/_FeatureSubPane.html" ],
function( declare,
          lang,
          array,
          topic,
          _ControlPaneMixin,
          _DescriptionMixin,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare([ _WidgetBase, _TemplatedMixin, _ControlPaneMixin, _DescriptionMixin ], {
        /**
         * How many controls are we allowed? We can have two traits for example. If -1, not enforced.
         *
         * @final
         * @public int
         */
        allowedControls : -1,
        /**
         * Displayed name of the feature.
         *
         * @final
         * @public string
         */
        value : "",
        /**
         * ID used to look up the feature. Usually the same as .value.
         *
         * @final
         * @public string
         */
        key : "",
        /**
         * Longer description of the feature.
         *
         * @final
         * @public string
         */
        description : "",
        /**
         * The data object matching the feature being displayed.
         *
         * @final
         * @public Object
         */
        data : {},
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then subscribe to /PleasePublishInfo/ to publishInfo. Then .setDescription from data (in
         * _DescriptionMixin).
         *
         * @public void
         */
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/PleasePublishInfo/", lang.hitch( this, this.publishInfo ) ) );
            this.setDescription( this.data );
        },
        /**
         * Modify kwObj by adding .key and .data from self's properties, then .inherited on it.
         *
         * @param kwObj
         * @public void
         */
        addFeature : function( /* Object */ kwObj )
        {
            kwObj = kwObj || {};
            kwObj.key = this.key;
            kwObj.data = this.data;
            this.inherited( arguments, [ kwObj ] );
        },
        /**
         * Remove control from .controls and .publishInfo().
         *
         * @param control
         */
        pleaseRemoveControl : function( /* Widget */ control )
        {
            this.controls.splice( array.indexOf( this.controls, control ), 1 );
            this.publishInfo();
        },
        /**
         * Map "state" to ._getState(), else inherited.
         *
         * @param prop
         * @public {*}
         */
        get : function( /* string */ prop )
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
         * Map "state" to ._setState(), else inherited.
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
                return this.inherited( arguments );
            }
        },
        /**
         * Returns state as kwObj with name, key, controls; the latter contains the states of all the child controls.
         *
         * @private Object
         */
        _getState : function()
        {
            var ctl = [];
            for( var i = 0; i < this.controls.length; i++ )
            {
                ctl.push( this.controls[ i ].get( "state" ) );
            }
            return {
                name : this.data.name,
                key : this.key,
                controls : ctl
            }
        },
        /**
         * Sets state from state. Loops through state.controls to create children to match.
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object */ state )
        {
            this.inherited( arguments );
            this.key = state.key;
            for( var i = 0; i < state.controls.length; i++ )
            {
                this.addControl({ data : this.data }).set( "state", state.controls[ i ] );
            }
        }
    });
});