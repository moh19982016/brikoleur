/**
 * Training control. Extends _ItemControlBase with features which connect it to task resolution.
 *
 * @private ItemControl
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dojo/dom-class",
          "./../../_base/_ItemControlBase",
          "dojo/text!./templates/_TrainingControl.html" ],
function( declare,
          lang,
          topic,
          domClass,
          _ItemControlBase,
          template )
{
    return declare( [ _ItemControlBase ], {
        /**
         * Symbol for the training.
         *
         * @public string
         */
        symbol : "K",
        /**
         * True unless it's the control for the Untrained action.
         *
         * @public boolean
         */
        trained : true,
        /**
         * Symbols for the various training levels (untrained, knack, trained, specialised.)
         *
         * @final
         * @public Object
         */
        SYMBOLS : {
            UNTRAINED : "U",
            L0 : "K",
            L1 : "T",
            L2 : "S"
        },
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Sets .symbol from from level (or untrained if not .trained).
         *
         * @public void
         */
        postMixInProperties : function()
        {
            this.symbol = this.trained ? this.SYMBOLS[ "L" + this.level ] : this.SYMBOLS.UNTRAINED;
        },
        /**
         * Inherited. If not trained, add a CSS class to mark it as the untrained control, and subscribe to topic
         * which marks self as active (or not).
         *
         * @public void
         */
        postCreate : function()
        {
            this.inherited( arguments );
            if( !this.trained )
            {
                domClass.add( this.domNode, "br-untrainedSkill" );
            }
            this.own( topic.subscribe( "/PrepareTask/", lang.hitch( this, this._setAppearance ) ) );
        },
        /**
         * Fires onClick. Puts self as Controller.lastClicked, and publishes /PrepareTask/ which kicks off the task
         * preparation process. Since we also subscribe to the topic, appearance will be set accordingly.
         *
         * @param isAttack
         */
        pleasePrepareTask : function( isAttack )
        {
            Controller.lastClicked = this;
            topic.publish( "/PrepareTask/", this, isAttack === true );
        },
        /**
         * Inherited, then adds CSS classes for different types of training (combat, defence, ranged attack).
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object */ state )
        {
            this.inherited( arguments );
            if( this.state.type == "combat" )
            {
                domClass.add( this.domNode, "br-hideOutOfCombat" );
            }
            if( this.state.value.indexOf( "Ranged Defence" ) != -1  )
            {
                domClass.add( this.domNode, "br-defenceTraining" );
            }
            if( /(Light|Medium|Heavy) Ranged/.test( this.state.value ) )
            {
                domClass.add( this.domNode, "br-rangedAttackTraining" );
            }
        },
        /**
         * Passes own .defence flag to created child with state.
         *
         * @param state
         * @private void
         */
        _setChildState : function( /* Object */ state )
        {
            if( state.value )
            {
                state.defence = this.state.defence;
                this.createChildControl( {} ).set( "state", state );
            }
        },
        /**
         * If widg is self, mark self as selected, else if widg is the same type as self, unmark.
         *
         * @param widg
         * @private void
         */
        _setAppearance : function( /* Widget */ widg )
        {
            if( widg == this )
            {
                domClass.add( this.clickNode, "br-bonusSelected" );
            }
            else if( widg instanceof this.parent.childConstructor )
            {
                domClass.remove( this.clickNode, "br-bonusSelected" );
            }
        }
    } );
} );