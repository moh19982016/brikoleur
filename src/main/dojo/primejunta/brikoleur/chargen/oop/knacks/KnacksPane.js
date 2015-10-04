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
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          _FeaturePaneBase,
          _ControlPaneMixin,
          _KnackControl,
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
        allowedControls : 3,
        /**
         * Control used to assign and display the feature we're dealing with.
         *
         * @final
         * @public constructor
         */
        featureControl : _KnackControl,
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
         * Increment .allowedControls since it is a bonus knack; then .addControl and set its state to display the
         * knack, then .addChildControl() on it to lock it into place.
         *
         * @param knack
         * @private void
         */
        _addBonusKnack : function( /* Object */ knack )
        {
            this.allowedControls++;
            if( knack )
            {
                var ctl = this.addControl( {}, "first" );
                ctl.set( "state", {
                    key : knack,
                    value : knack
                });
                ctl.addChildControl();
            }
        }
    });
});