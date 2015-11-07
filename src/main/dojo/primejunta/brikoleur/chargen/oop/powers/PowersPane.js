/**
 * Pane managing Powers.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../data/traits",
         "./../../_base/_FeaturePaneBase",
         "./../_base/util",
         "./../_base/_ControlPaneMixin",
         "./../_base/_SubPaneContainerMixin",
         "./_PowerSubPane",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          traits,
          _FeaturePaneBase,
          util,
          _ControlPaneMixin,
          _SubPaneContainerMixin,
          _PowerSubPane,
          i18n )
{
    return declare([ _FeaturePaneBase, _ControlPaneMixin, _SubPaneContainerMixin ],
    {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.Powers,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "bolt",
        /**
         * Number of controls allowed (-1 is unlimited).
         *
         * @public int
         */
        allowedControls : -1,
        /**
         * Data for the feature.
         *
         * @public Object
         */
        data : traits,
        /**
         * Control used to assign and display the feature we're dealing with.
         *
         * @final
         * @public constructor
         */
        childConstructor : _PowerSubPane,
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedPowers/",
        /**
         * Topic fired when the associated master item is selected (in this case, trait).
         *
         * @final
         * @public string
         */
        selectedMasterItemTopic : "/SelectedTraits/",
        /**
         * Name of property we're dealing with in data.
         *
         * @final
         * @public string
         */
        featureProperty : "powers",
        /**
         * Inherited, then subscribe to topics fired when powers are made active or inactive, the active power slots
         * stat changes, or a bonus power should be added.
         *
         * @public void
         */
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/ActivePowerSet/", lang.hitch( this, this._checkActivePowers ) ) );
            this.own( topic.subscribe( "/StatChanged/-aps", lang.hitch( this, this._checkActivePowers ) ) );
            this.own( topic.subscribe( "/AddBonusPower/", lang.hitch( this, function( kwObj )
            {
                this.addFeature({
                    key : kwObj.key,
                    value : kwObj.key,
                    data : kwObj.data
                });
            })));
        },
        /**
         * Publish call to set/unset disabled for unchecked setActive controls depending on count of active properties
         * compared to APS stat.
         *
         * @private void
         */
        _checkActivePowers : function()
        {
            topic.publish( "/SetActiveControlDisabled/", util.getProperties( this.controls, { property : "active", recurse : true, filter : true } ).length >= Controller.get( "aps" ) );
        }
    });
});