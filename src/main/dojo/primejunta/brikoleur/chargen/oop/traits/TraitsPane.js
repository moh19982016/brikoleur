/**
 * Pane controlling traits.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "./../../_base/_FeaturePaneBase",
         "./../_base/_ControlPaneMixin",
         "./_TraitControl",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          _FeaturePaneBase,
          _ControlPaneMixin,
          _TraitControl,
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
        title : i18n.Traits,
        /**
         * Feature name. Used in validation failure message.
         *
         * @final
         * @public string
         */
        featureName : i18n.Traits,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "asterisk",
        /**
         * Number of controls allowed.
         *
         * @public int
         */
        allowedControls : 2,
        /**
         * Control used to assign and display the feature we're dealing with.
         *
         * @final
         * @public constructor
         */
        childConstructor : _TraitControl,
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedTraits/",
        displayCount : function()
        {
            this.inherited( arguments );
            if( this._remainingItems == 0 )
            {
                Controller.characterPane.panes.knacks.maximize();
                Controller.characterPane.panes.numbers.maximize();
                Controller.characterPane.panes.ohun.maximize();
                Controller.characterPane.panes.gear.maximize();
                Controller.characterPane.panes.description.maximize();
            }
        }
    });
});