/**
 * Pane managing Ohun.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../data/traits",
         "./../../_base/_FeaturePaneBase",
         "./../_base/_ControlPaneMixin",
         "./../_base/_SubPaneContainerMixin",
         "./_OhunSubPane",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          traits,
          _FeaturePaneBase,
          _ControlPaneMixin,
          _SubPaneContainerMixin,
          _OhunSubPane,
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
        title : i18n.Ohun,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "star",
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
        childConstructor : _OhunSubPane,
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedOhun/",
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
        featureProperty : "ohun",
        /**
         * Inherited, then subscribe to /AddBonusOhun/ to add a bonus ohun via .addFeature.
         *
         * @public void
         */
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/AddBonusOhun/", lang.hitch( this, function( kwObj )
            {
                this.addFeature({
                    key : kwObj.key,
                    value : kwObj.key,
                    data : kwObj.data
                });
            })));
        }
    });
});