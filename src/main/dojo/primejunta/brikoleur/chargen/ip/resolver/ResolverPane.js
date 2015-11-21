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
          "dojo/text!./templates/ResolverPane.html",
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
          template,
          i18n )
{
    return declare( [ _FeaturePaneBase ],
    {
        title : i18n.ResolveTask,
        icon : "☭",
        iconType : "literal",
        trainingBonus : 0,
        childConstructor : _TrainingControl,
        dict : i18n,
        templateString : template,
        buildRendering : function()
        {
            this.inherited( arguments );
            this.attackControls = [];
            this.resourcesBonusControl =
            new _BonusControl( { manager : this, title : i18n.ResourceBonus } ).placeAt( this.resourcesNode );
            this.intelBonusControl =
            new _BonusControl( { manager : this, title : i18n.IntelBonus, className : "br-hideInCombat" } ).placeAt(
            this.intelNode );
            this.coverBonusControl =
            new _BonusControl( {
                manager : this,
                title : i18n.CoverBonus,
                max : 99,
                className : "br-hideOutOfCombat"
            } ).placeAt( this.intelNode );
            this.ohunBonusControl =
            new _BonusControl( {
                manager : this,
                title : i18n.OhunBonus,
                max : 99,
                numbers : [ 0, 1, 2, 3, 4, 5, 6, 7, -1 ]
            } ).placeAt( this.ohunNode );
            this.resolverControl = new _ResolverControl( { manager : this } ).placeAt( this.resolveNode );
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
            if( Controller.lastClicked && Controller.lastClicked.state.defence )
            {
                this.resolveDefenceAction( widg.state );
            }
            else
            {
                this.resolveTask( isAttack );
            }
        },
        pleaseResolveAttack : function( data )
        {
            this.resourcesBonusControl.setBonus( Math.min( 3, data.value.level ) );
            this.resolverControl.set( "base-damage", data.value.damage );
            var knack = data.value.itemType.charAt( 1 ) == 'R' ? i18n.RangedCombat : i18n.CloseCombat;
            var training = i18n[ data.value.itemType ];
            var specialisation = data.value.specialisation;
            this._findTraining( this.attackControls, [ knack, training, specialisation ] );
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
        resolveDefenceAction : function( data )
        {
            if( data.value.indexOf( "Ranged" ) == -1 )
            {
                this.intelBonusControl.set( "bonus", 0 );
                this.resolveTask();
                return;
            }
            var maxBonus = this.trainingBonus;
            var bonus = ( Math.min( maxBonus, this.coverBonusControl.bonus )
                          + this.coverBonusControl.bonus
                          + this.ohunBonusControl.bonus
                          + maxBonus );
            this.resolverControl.set( "bonus", bonus );
            this.resourcesBonusControl.set( "max", maxBonus );
            this.resourcesBonusControl.set( "bonus", this.coverBonusControl.bonus );
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
            this._addTraining( { parent : this, trained : false }, { value : "Untrained" }, this.attackTrainingNode );
            this._addTraining( { parent : this, trained : false }, { value : "Untrained", defence : true }, this.defenceTrainingNode );
            this._addTraining( { parent : this, trained : false }, { value : "Untrained" }, this.otherTrainingNode );
            for( var i = 0; i < state.length; i++ )
            {
                if( state[ i ].type != "combat" )
                {
                    this._addTraining({ parent : this }, state[ i ], this.otherTrainingNode );
                }
                else
                {
                    this._addTraining({ parent : this }, state[ i ], this.attackTrainingNode, this.attackControls );
                    this._addTraining({ parent : this }, lang.mixin( lang.clone( state[ i ] ), { defence : true }), this.defenceTrainingNode );
                }
            }
        },
        _addTraining : function( props, state, node, arr )
        {
            var ctrl = new _TrainingControl( props ).placeAt( node );
            ctrl.set( "state", state );
            this.controls.push( ctrl );
            if( arr )
            {
                arr.push( ctrl );
            }
        }
    } );
} );