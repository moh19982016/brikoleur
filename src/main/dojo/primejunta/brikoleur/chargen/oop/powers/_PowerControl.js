define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "dijit/form/CheckBox",
        "./../_base/_FeatureControlBase",
        "./../_base/_PoweredAbilityMixin",
        "./../../_base/util",
        "dojo/text!./templates/_PowerControl.html",
        "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          CheckBox,
          _FeatureControlBase,
          _PoweredAbilityMixin,
          util,
          template,
          i18n )
{
    var Constr = declare([ _FeatureControlBase, _PoweredAbilityMixin ], {
        data : {},
        selectedFeaturesTopic : "/SelectedPowers/",
        featureAddedTopic : "/PowerAdded/",
        propertyPresentWarning : i18n.PowerPresent,
        templateString : template,
        maxLevel : 3,
        statName : "M",
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/SetActiveControlDisabled/", lang.hitch( this, this._setActiveControlDisabled ) ) );
            this.own( topic.subscribe( "/StatChanged/-aps", lang.hitch( this, this._checkMax ) ) );
            this.childConstructor = Constr;
        },
        getCost : function()
        {
            return this.level + 2;
        },
        _checkMax : function( max )
        {
            this.maxLevel = max - 1;
            if( this.complete && this.level == max - 2 )
            {
                this.addChildControl();
            }
        },
        _setActiveControlDisabled : function( to )
        {
            if( !this.activeBox.get( "checked" ) )
            {
                this.activeBox.set( "disabled", to );
            }
        },
        _setActive : function()
        {
            this.active = this.activeBox.get( "checked" );
            topic.publish( "/ActivePowerSet/" );
            this._publishChange();
        },
        _getState : function()
        {
            var stat = this.inherited( arguments );
            stat.active = this.activeBox.get( "checked" );
            return stat;
        },
        _setState : function( stat )
        {
            this.inherited( arguments );
            this.active = stat.active;
            this.activeBox.set( "checked", stat.active );
        }
    });
    return Constr;
});