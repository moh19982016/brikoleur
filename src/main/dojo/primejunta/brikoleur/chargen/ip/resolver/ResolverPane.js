/**
 * Task resolver pane.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dojo/dom-construct",
          "./_TrainingControl",
          "./_BonusControl",
          "./_ResolverControl",
          "./../../oop/_base/util",
          "./../../_base/_FeaturePaneBase",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          domConstruct,
          _TrainingControl,
          _BonusControl,
          _ResolverControl,
          util,
          _FeaturePaneBase,
          i18n )
{
    return declare( [ _FeaturePaneBase ],
    {
        title : i18n.ResolveTask,
        icon : "☭",
        iconType : "literal",
        trainingBonus : 0,
        childConstructor : _TrainingControl,
        buildRendering : function()
        {
            this.inherited( arguments );
            this.resourcesNode = domConstruct.create( "div", { "class" : "br-floatLeft br-bonusNode" }, this.domNode );
            this.intelNode = domConstruct.create( "div", { "class" : "br-floatLeft br-bonusNode" }, this.domNode );
            this.ohunNode = domConstruct.create( "div", { "class" : "br-floatLeft br-bonusNode" }, this.domNode );
            this.trainingNode =
            domConstruct.create( "div", { "class" : "br-floatLeft br-trainingNode" }, this.domNode );
            this.resolveNode = domConstruct.create( "div", { "class" : "br-resolveContainer" }, this.domNode );
            this.resourcesBonusControl =
            new _BonusControl( { manager : this, title : i18n.ResourceBonus } ).placeAt( this.resourcesNode );
            this.intelBonusControl =
            new _BonusControl( { manager : this, title : i18n.IntelBonus } ).placeAt( this.intelNode );
            this.ohunBonusControl =
            new _BonusControl( {
                manager : this,
                title : i18n.OhunBonus,
                max : 99,
                numbers : [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
            } ).placeAt( this.ohunNode );
            this.resolverControl = new _ResolverControl( { manager : this } ).placeAt( this.resolveNode );
            domConstruct.create( "div", { "style" : "clear:both" }, this.domNode );
        },
        postCreate : function()
        {
            this.own( topic.subscribe( "/ResolveTask/", lang.hitch( this, this.pleaseResolveTask ) ) );
            this.own( topic.subscribe( "/PleaseAttack/", lang.hitch( this, this.pleaseResolveAttack ) ) );
        },
        pleaseResolveTask : function( widg, isAttack )
        {
            if( widg instanceof _TrainingControl )
            {
                this.trainingBonus = widg.trained ? widg.level + 1 : 0;
            }
            this.resolveTask( isAttack );
        },
        pleaseResolveAttack : function( data )
        {
            this.resourcesBonusControl.setBonus( Math.min( 3, data.value.level ) );
            this.resolverControl.set( "base-damage", data.value.damage );
            var knack = data.value.itemType.charAt( 1 ) == 'R' ? i18n.RangedCombat : i18n.CloseCombat;
            var training = i18n[ data.value.itemType ];
            var specialisation = data.value.specialisation;
            this._findTraining( this.controls, [ knack, training, specialisation ] );
        },
        resolveTask : function( isAttack )
        {
            var maxBonus = this.trainingBonus;
            var tBonus = ( Math.min( maxBonus, this.resourcesBonusControl.bonus )
                           + Math.min( maxBonus, this.intelBonusControl.bonus )
                           + this.ohunBonusControl.bonus
                           + maxBonus );
            this.resolverControl.set( "bonus", tBonus );
            this.resourcesBonusControl.set( "max", maxBonus );
            this.intelBonusControl.set( "max", maxBonus );
            if( !isAttack )
            {
                this.resolverControl.set( "base-damage", false );
            }
        },
        _findTraining : function( controls, path )
        {
            var name = path.shift();
            for( var i = 0; i < controls.length; i++ )
            {
                if( controls[ i ].get( "value" ) == name )
                {
                    controls[ i ].pleaseResolveTask( true );
                    if( path.length > 0 )
                    {
                        this._findTraining( controls[ i ].controls, path )
                    }
                }
            }
        },
        _setState : function( state )
        {
            this.clear();
            var ctrl = new _TrainingControl( { parent : this, trained : false } ).placeAt( this.trainingNode );
            ctrl.set( "state", { value : "Untrained" } );
            this.controls.push( ctrl );
            for( var i = 0; i < state.length; i ++ )
            {
                ctrl = new _TrainingControl( { parent : this } ).placeAt( this.trainingNode );
                ctrl.set( "state", state[ i ] );
                this.controls.push( ctrl );
            }
        }
    } );
} );