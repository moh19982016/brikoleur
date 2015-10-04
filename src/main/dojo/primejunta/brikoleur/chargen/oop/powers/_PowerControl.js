/**
 * Control for individual Powers.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dijit/form/CheckBox",
         "./../_base/_FeatureControlBase",
         "./../_base/_PoweredAbilityMixin",
         "dojo/text!./templates/_PowerControl.html",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          CheckBox,
          _FeatureControlBase,
          _PoweredAbilityMixin,
          template,
          i18n )
{
    var Constr = declare([ _FeatureControlBase, _PoweredAbilityMixin ], {
        /**
         * Maximum depth allowed for descendants for controls of this type.
         *
         * @public int
         */
        maxLevel : 3,
        /**
         * Data for the feature.
         *
         * @public Object
         */
        data : {},
        /**
         * Topic published when feature selection changes. The list of selected features will be included.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/SelectedPowers/",
        /**
         * Topic published when a feature of this type is added. Used to update state f.ex. if there are limits to the
         * number of controls we can add.
         *
         * @final
         * @public string
         */
        featureAddedTopic : "/PowerAdded/",
        /**
         * Warning to display if trying add another item with the same name and type.
         *
         * @final
         * @public string
         */
        propertyPresentWarning : i18n.PowerPresent,
        /**
         * Identifier of stat powering the feature -- for powers, Mind.
         *
         * @final
         * @public string
         */
        statName : "Ⓜ",
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then subscribe to topic for disabling active controls, and stat changes for active power slots.
         *
         * @public void
         */
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/SetActiveControlDisabled/", lang.hitch( this, this._setActiveControlDisabled ) ) );
            this.own( topic.subscribe( "/StatChanged/-aps", lang.hitch( this, this._checkMax ) ) );
            this.childConstructor = Constr;
        },
        /**
         * Cost for powers is .level + 2.
         *
         * @public int
         */
        getCost : function()
        {
            return this.level + 2;
        },
        /**
         * Sets .maxLevel from max, and .addChildControl if necessary.
         *
         * @param max
         * @private void
         */
        _checkMax : function( /* int */ max )
        {
            this.maxLevel = max - 1;
            if( this.complete && this.level == max - 2 && !this._hasActiveChild() )
            {
                this.addChildControl();
            }
        },
        /**
         * If activeBox is not checked, disable/enable it. (Checked ones are never disabled; you can always uncheck
         * them.)
         *
         * @param to
         * @private void
         */
        _setActiveControlDisabled : function( /* boolean */ to )
        {
            if( !this.activeBox.get( "checked" ) )
            {
                this.activeBox.set( "disabled", to );
            }
        },
        /**
         * Sets .active to .cheched of .activeBox, publishes a topic about it being changed (which will cause other
         * _PowerControls to disable/enable their checkboxes as necessary), and ._publishChange.
         *
         * @private void
         */
        _setActive : function()
        {
            this.active = this.activeBox.get( "checked" );
            topic.publish( "/ActivePowerSet/" );
            this._publishChange();
        },
        /**
         * Gets state with .inherited, adds .active property to it, and returns it.
         *
         * @private Object
         */
        _getState : function()
        {
            var state = this.inherited( arguments );
            state.active = this.activeBox.get( "checked" );
            return state;
        },
        /**
         * Inherited, plus sets .activeBox.checked from state.active.
         * 
         * @param state
         * @private void
         */
        _setState : function( state )
        {
            this.inherited( arguments );
            this.active = state.active;
            this.activeBox.set( "checked", state.active );
        }
    });
    return Constr;
});