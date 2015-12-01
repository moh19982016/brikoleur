/**
 * Task resolver pane.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "./_TrainingControl",
          "./_BonusControl",
          "./_ResolverControl",
          "./../../_base/_FeaturePaneBase",
          "dojo/text!./templates/ResolverPane.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          _TrainingControl,
          _BonusControl,
          _ResolverControl,
          _FeaturePaneBase,
          template,
          i18n )
{
    return declare( [ _FeaturePaneBase ],
    {
        /**
         * Bonus from training. This is important because it caps the other bonuses.
         *
         * @public int
         */
        trainingBonus : 0,
        /**
         * Child constructor.
         *
         * @final
         * @public Function
         */
        childConstructor : _TrainingControl,
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.ResolveTask,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "☭",
        /**
         * Icon type: this one's a literal rather than a CSS class.
         *
         * @final
         * @public string
         */
        iconType : "literal",
        /**
         * Localization.
         *
         * @final
         * @public Object
         */
        dict : i18n,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then set up bonusControls and _ResolverControl. Training is set up in ._setState.
         *
         * @public void
         */
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
        /**
         * Subscribe to /PrepareTask/ and /PrepareAttack/ topics, fired when we need to do stuff.
         *
         * @public void
         */
        postCreate : function()
        {
            this.own( topic.subscribe( "/PrepareTask/", lang.hitch( this, this.pleasePrepareTask ) ) );
            this.own( topic.subscribe( "/PrepareAttack/", lang.hitch( this, this.pleasePrepareAttack ) ) );
        },
        /**
         * Basic task resolution: reset .trainingBonus if needed, determine if it's a defence action or regular action,
         * and resolve it. The isAttack flag is set if it originated from a click on a weapon.
         *
         * @param widg
         * @param isAttack
         * @public void
         */
        pleasePrepareTask : function( /* Control */ widg, /* boolean */ isAttack )
        {
            if( widg instanceof _TrainingControl )
            {
                this.trainingBonus = widg.trained ? widg.level + 1 : 0;
            }
            if( Controller.lastClicked && Controller.lastClicked.state.defence )
            {
                this.prepareDefenceAction( widg.state );
            }
            else
            {
                this.prepareTask( isAttack );
            }
        },
        /**
         * We're dealing with an attack action from an item, so set up bonuses and training from what we know of it.
         *
         * @param data
         * @public void
         */
        pleasePrepareAttack : function( /* Object */ data )
        {
            this.resourcesBonusControl.setBonus( Math.min( 3, data.value.level ) );
            this.resolverControl.set( "base-damage", data.value.damage );
            var knack = data.value.itemType.charAt( 1 ) == 'R' ? i18n.RangedCombat : i18n.CloseCombat;
            var training = i18n[ data.value.itemType ];
            var specialisation = data.value.specialisation;
            this._findTraining( this.attackControls, [ knack, training, specialisation ] );
        },
        /**
         * If it's not an attack, reset base-damage. Calculate and set up bonuses based on trainingBonus.
         *
         * @param isAttack
         * @public void
         */
        prepareTask : function( /* boolean */ isAttack )
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
        /**
         * Close defence actions are prepared just like any other actions, except intel bonus is always zero.
         * Ranged defence actions are a bit more complicated as they include the cover bonus which is improved if the
         * player has Ranged Defence training.
         *
         * @param data
         * @public void
         */
        prepareDefenceAction : function( /* Object */ data )
        {
            if( data.value.indexOf( "Ranged" ) == -1 )
            {
                this.intelBonusControl.set( "bonus", 0 );
                this.prepareTask();
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
        /**
         * Recursively looks up the training matching path in controls and calls ::pleasePrepareTask on any hits.
         * Whatever was last found remains in force.
         *
         * @param controls
         * @param path
         * @private void
         */
        _findTraining : function( /* Control[] */ controls, /* string[] */ path )
        {
            var name = path.shift();
            for( var i = 0; i < controls.length; i++ )
            {
                if( controls[ i ].get( "value" ) == name )
                {
                    controls[ i ].pleasePrepareTask( true );
                    if( path.length > 0 )
                    {
                        this._findTraining( controls[ i ].controls, path )
                    }
                }
            }
        },
        /**
         * Clear, then _addTraining everywhere needed. This is a bit more complex than in character creation since we
         * also need controls for untrained actions, they're categorised as defence, attack, and other, and the same
         * training may be present in multiple places.
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object[] */ state )
        {
            this.clear();
            this._addTraining( { parent : this, trained : false }, { value : "Untrained" }, this.attackTrainingNode );
            this._addTraining( { parent : this, trained : false },
                               { value : "Untrained", defence : true },
                               this.defenceTrainingNode );
            this._addTraining( { parent : this, trained : false }, { value : "Untrained" }, this.otherTrainingNode );
            for( var i = 0; i < state.length; i++ )
            {
                if( state[ i ].type != "combat" )
                {
                    this._addTraining( { parent : this }, state[ i ], this.otherTrainingNode );
                }
                else
                {
                    this._addTraining( { parent : this },
                                       state[ i ],
                                       this.attackTrainingNode,
                                       this.attackControls );
                    this._addTraining( { parent : this },
                                       lang.mixin( lang.clone( state[ i ] ),
                                       { defence : true } ),
                                       this.defenceTrainingNode );
                }
            }
        },
        /**
         * Creates a _TrainingControl with props, sets its state to state, places it in node, and adds it to arr (in
         * addition to this.controls) if provided.
         *
         * @param props
         * @param state
         * @param node
         * @param arr
         * @private void
         */
        _addTraining : function( /* Object */ props, /* Object */ state, /* Element */ node, /* Control[]? */ arr )
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