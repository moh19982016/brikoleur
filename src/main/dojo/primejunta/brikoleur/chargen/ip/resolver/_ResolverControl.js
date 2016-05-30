/**
 * Control for displaying and resolving a task, once all the bonuses are known.
 *
 * @private Control
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dojo/Deferred",
          "dojo/dom-class",
          "./../_base/NumberInput",
          "./../../_base/fx",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dijit/_WidgetsInTemplateMixin",
          "dojo/text!./templates/_ResolverControl.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          Deferred,
          domClass,
          NumberInput,
          fx,
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        /**
         * Task difficulty.
         *
         * @public int
         */
        difficulty : 5,
        /**
         * Total bonus.
         *
         * @public int
         */
        bonus : 0,
        /**
         * Dice symbols.
         *
         * @final
         * @public Object
         */
        DICE : {
            "D1" : "⚀",
            "D2" : "⚁",
            "D3" : "⚂",
            "D4" : "⚃",
            "D5" : "⚄",
            "D6" : "⚅"
        },
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
         * Set up state with ._resetDie, then subscribe to /PrepareTask/ to do the same.
         *
         * @public void
         */
        postCreate : function()
        {
            this._resetDie();
            this.own( topic.subscribe( "/PrepareTask/", lang.hitch( this, this._resetDie ) ) );
        },
        /**
         * Set .difficulty to value and ._resetDie.
         *
         * @param value
         * @public void
         */
        setDifficulty : function( /* int */ value )
        {
            this.difficulty = value;
            this._resetDie();
        },
        /**
         * Fires when user clicks on the target bubble. If a die result is displayed, resets die. Else rolls die.
         *
         * @public void
         */
        onDieClick : function()
        {
            if( this._resultShown )
            {
                this._resetDie();
            }
            else
            {
                this.rollDie();
            }
        },
        onAttack : function()
        {
            this.rollDie().then( lang.hitch( this, function( result )
            {
                this.set( "calculated-damage", this._calcDamage( result ) );
                this.set( "damage", Math.max( 0, this._calcDamage( result ) - this.armourControl.get( "value" ) ) );
            }));
        },
        onDefend : function()
        {
            this.rollDie().then( lang.hitch( this, function( result )
            {
                var dmg = this._calcDefenceDamage( result );
                var fDmg = dmg - this.defenceArmourControl.get( "value" );
                this.set( "defence-calculated-damage", dmg );
                this.set( "defence-damage", fDmg );
                topic.publish( "/DamageTaken/", fDmg );
            } ) );
        },
        /**
         * Roll a die with ._rollFx, then compute the results depending on what type of task we're resolving (attack,
         * defence, or other). Will display computed damage and fire off /DamageTaken/ if needed.
         *
         * @public void
         */
        rollDie : function()
        {
            var prom = new Deferred();
            this._resultShown = true;
            domClass.remove( this.rollDieNode, "br-automaticSuccess br-taskFailed" );
            this.dieLabelNode.innerHTML = i18n.RollDie;
            var n = Math.round( 0.5 + Math.random() * 6 );
            this._rollFx( n, 7 ).then( lang.hitch( this, function()
            {
                var result = ( this.bonus + n ) - this.difficulty;
                if( domClass.contains( Controller.inPlayPane.domNode, "br-status-wounded" ) )
                {
                    result -= 1;
                }
                this.taskResultNode.innerHTML = result;
                domClass.replace( this.taskResultNode,
                result < 0 ? "br-taskFailed" : "br-taskSucceeded",
                "br-taskFailed br-taskSucceeded" );
                prom.resolve( result );
            } ) );
            return prom;
        },
        /**
         * Intercepts "bonus", "base-damage", and "damage".
         *
         * @param prop
         * @param val
         * @public void
         */
        set : function( /* string */ prop, /* {*} */ val )
        {
            switch( prop )
            {
                case "bonus" :
                    this.bonus = val;
                    this.totalBonusNode.innerHTML = val;
                    this._resetDie();
                    break;
                case "base-damage" :
                    this.baseDamageControl.set( "value", val || 4 );
                    this.damageNode.innerHTML = val || "?";
                    domClass.remove( this.damageNode, "br-valueChanged" );
                    break;
                case "damage" :
                    this.damageNode.innerHTML = "" + val || "?";
                    fx.flash( this.damageNode, "br-valueChanged" );
                    break;
                case "calculated-damage" :
                    this.calculatedDamageNode.innerHTML = "" + val || "?";
                    fx.flash( this.calculatedDamageNode, "br-valueChanged" );
                    break;
                case "weapon-level" :
                    this.weaponLevelControl.set( "value", val || 0 );
                    break;
                case "defence-calculated-damage" :
                    this.defenceCalculatedDamageNode.innerHTML = "" + val ||"?";
                    fx.flash( this.defenceCalculatedDamageNode, "br-valueChanged" );
                    break;
                case "defence-damage" :
                    this.defenceDamageNode.innerHTML = "" + val ||"?";
                    fx.flash( this.defenceDamageNode, "br-valueChanged" );
                    break;
                default :
                    this.inherited( arguments );

            }
        },
        /**
         * If result is positive, compute the damage from baseDamage, by how much it beat it, and armour.
         *
         * @param reslt
         * @private int
         */
        _calcDamage : function( /* int */ reslt )
        {
            if( reslt < 0 )
            {
                return 0;
            }
            else
            {
                return Math.max( 0,
                this.baseDamageControl.get( "value" ) +
                Math.max( 0, ( reslt - 1 ) * this.baseDamageControl.get( "value" ) ) +
                this.weaponLevelControl.get( "value" ) );
            }
        },
        /**
         * Computes defence damage, which is slightly different from attack damage (and has the sign reversed).
         *
         * @param reslt
         * @private int
         */
        _calcDefenceDamage : function( /* int */ reslt )
        {
            return this._calcDamage( -reslt );
        },
        /**
         * Visual FX for a die roll. We already know the finalValue. Returns a Deferred which is resolved when the FX
         * completes.
         *
         * @param finalValue
         * @param iter
         * @param prom
         * @private Deferred
         */
        _rollFx : function( /* int */ finalValue, /* int */ iter, /* Deferred? */ prom )
        {
            prom = prom || new Deferred();
            var dice = [ 1, 5, 6, 2, 4, 3 ];
            var n = finalValue;
            if( iter > 0 )
            {
                n = dice[ iter % dice.length ];
            }
            this.rollDieNode.innerHTML = "<span class='br-dieRoll'>" + this.DICE[ "D" + n ] + "</span>";
            if( iter > 0 )
            {
                setTimeout( lang.hitch( this, this._rollFx, finalValue, iter - 1, prom ), 100 );
            }
            else
            {
                prom.resolve();
            }
            return prom;
        },
        /**
         * Resets die node and task result node, removes any classes added for them, and sets armour value from worn
         * armour if widg represents a defence action.
         *
         * @param widg
         * @private void
         */
        _resetDie : function( /* Control? */ widg )
        {
            this._resultShown = false;
            this.dieLabelNode.innerHTML = i18n.DieTarget;
            var bonus = this.bonus;
            if( domClass.contains( Controller.inPlayPane.domNode, "br-status-wounded" ) )
            {
                bonus -= 1;
            }
            var target = this.difficulty - bonus;
            this.set( "calculated-damage", 0 );
            this.set( "damage", 0 );
            domClass.remove( this.rollDieNode, "br-automaticSuccess br-taskFailed" );
            domClass.remove( this.taskResultNode, "br-taskSucceeded br-taskFailed" );
            if( target <= 1 )
            {
                domClass.add( this.rollDieNode, "br-automaticSuccess" );
                domClass.add( this.taskResultNode, "br-taskSucceeded" );
                target = 1;
            }
            else if( target > 6 )
            {
                domClass.add( this.rollDieNode, "br-taskFailed" );
                domClass.add( this.taskResultNode, "br-taskFailed" );
                target = 6;
            }
            this.rollDieNode.innerHTML = target;
            this.taskResultNode.innerHTML = -1 * ( this.difficulty - bonus - target );
            if( widg && widg.get && ( widg.get( "state" ) || {} ).defence )
            {
                this.armourControl.set( "value",
                Controller.inPlayPane.getArmour().direct + Controller.inPlayPane.panes.numbers.get( "armour" ) );
            }
        }
    } );
} );