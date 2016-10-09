/**
 * Pane controlling traits.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "./../../_base/_FeaturePaneBase",
         "./../../data/traits",
         "./../../data/twists",
         "./_TraitSubPane",
         "dojo/topic",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          _FeaturePaneBase,
          traits,
          twists,
          _TraitSubPane,
          topic,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.TraitAndTwist,
        /**
         * Feature name. Used in validation failure message.
         *
         * @final
         * @public string
         */
        featureName : i18n.OneTraitOneTwist,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "asterisk",
        selectedFeaturesTopic : "/SelectedTraits/",

        postCreate : function()
        {
            this.inherited( arguments );
            this._traitSubPane = new _TraitSubPane({ data : traits, title : i18n.Trait } ).placeAt( this.containerNode );
            this._twistSubPane = new _TraitSubPane({ data : twists, title : i18n.Twist } ).placeAt( this.containerNode );
            this.own( this._traitSubPane, this._twistSubPane );
            this.own( topic.subscribe( "/SelectedTraits/", lang.hitch( this, this.displayCount ) ) );
        },
        displayCount : function()
        {
            if( this._traitSubPane.get( "state" ).controls[ 0 ].value && this._twistSubPane.get( "state" ).controls[ 0 ].value )
            {
                this._remainingItems = 0;
            }
            if( this._remainingItems == 0 )
            {
                Controller.characterPane.panes.knacks.maximize();
                Controller.characterPane.panes.numbers.maximize();
                Controller.characterPane.panes.ohun.maximize();
                Controller.characterPane.panes.gear.maximize();
                Controller.characterPane.panes.description.maximize();
            }
        },
        _getState : function( state )
        {
            return [ this._traitSubPane.get( "state" ), this._twistSubPane.get( "state" ) ];
        },
        _setState : function( state )
        {
            this._traitSubPane.set( "state", state[ 0 ] );
            this._twistSubPane.set( "state", state[ 1 ] );
        }
    });
});