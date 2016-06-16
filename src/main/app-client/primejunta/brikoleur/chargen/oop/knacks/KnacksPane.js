/**
 * Knack pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../_base/_FeaturePaneBase",
         "./../_base/_ControlPaneMixin",
         "./_KnackControl",
         "./_OgaControl",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          _FeaturePaneBase,
          _ControlPaneMixin,
          _KnackControl,
          _OgaControl,
          i18n )
{
    return declare([ _FeaturePaneBase, _ControlPaneMixin ],
    {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.KnacksAndTraining,
        /**
         * Feature name. Used in validation failure message.
         *
         * @final
         * @public string
         */
        featureName : i18n.Knacks,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "mortar-board",
        /**
         * Number of controls allowed.
         *
         * @public int
         */
        _allowedControls : 3,
        /**
         * Control used to assign and display the feature we're dealing with.
         *
         * @final
         * @public constructor
         */
        childConstructor : _KnackControl,
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedKnacks/",
        /**
         * Inherited, then subscribe to /AddBonusKnack/ with ._addBonusKnack.
         *
         * @public void
         */
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/AddBonusKnack/", lang.hitch( this, this._addBonusKnack ) ) );
        },
        /**
         * Checks state.oga and creates an _OgaControl instead of the usual, if it has .oga set.
         *
         * @param kwObj
         * @param pos
         * @param state
         * @public _OgaControl|_KnackControl
         */
        addControl : function( kwObj, pos, state )
        {
            if( state && state.oga )
            {
                var ctl = new _OgaControl( lang.mixin( kwObj || {}, { parent : this } )).placeAt( this.containerNode, "first" );
                this.controls.push( ctl );
                return ctl;
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        /**
         * Increment .allowedControls since it is a bonus knack; then .addControl and set its state to display the
         * knack, then .addChildControl() on it to lock it into place. If it's an oga, creates an oga pseudo-knack
         * instead.
         *
         * @param knack
         * @param type
         * @private void
         */
        _addBonusKnack : function( /* Object */ knack, /* string? */ type )
        {
            this.set( "allowedControls", this.allowedControls + 1 );
            if( knack )
            {
                var ctl = this.addControl({}, "first", { oga : type == "oga" } );
                ctl.set( "state", {
                    key : knack,
                    value : knack
                });
                ctl.addChildControl();
            }
            this.displayCount();
        }
    });
});