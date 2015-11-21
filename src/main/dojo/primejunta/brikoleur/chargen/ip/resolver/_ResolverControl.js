define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dojo/Deferred",
          "dojo/dom-class",
          "./../_base/NumberInput",
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
          _WidgetBase,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    return declare( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        dict : i18n,
        templateString : template,
        difficulty : 5,
        bonus : 0,
        DICE : {
            "D1" : "⚀",
            "D2" : "⚁",
            "D3" : "⚂",
            "D4" : "⚃",
            "D5" : "⚄",
            "D6" : "⚅"
        },
        postCreate : function()
        {
            this._resetDie();
            this.own( topic.subscribe( "/ResolveTask/", lang.hitch( this, this._resetDie ) ) );
        },
        setDifficulty : function( value )
        {
            this.difficulty = value;
            this._resetDie();
        },
        rollDie : function()
        {
            var n = Math.round( 0.5 + Math.random() * 6 );
            this._rollFx( n, 7 ).then( lang.hitch( this, function()
            {
                var result = ( this.bonus + n ) - this.difficulty;
                if( domClass.contains( Controller.inPlayPane.domNode, "br-status-wounded" ) )
                {
                    result -= 1;
                }
                this.taskResultNode.innerHTML = result;
                domClass.replace( this.taskResultNode, result < 0 ? "br-taskFailed" : "br-taskSucceeded", "br-taskFailed br-taskSucceeded" );
                if( this.baseDamageControl.get( "value" ) && Controller.inPlayPane.inCombat )
                {
                    if( Controller.lastClicked && Controller.lastClicked.state.defence )
                    {
                        this.set( "damage", this._calcDefenceDamage( result ) );
                        topic.publish( "/DamageTaken/", this._calcDefenceDamage( result ) );
                    }
                    else
                    {
                        this.set( "damage", this._calcDamage( result ) );
                    }
                }
            } ) );
        },
        set : function( prop, val )
        {
            if( prop == "bonus" )
            {
                this.bonus = val;
                this.totalBonusNode.innerHTML = val;
            }
            else if( prop == "base-damage" )
            {
                this.baseDamageControl.set( "value", val || 4 );
                this.damageNode.innerHTML = val || "?";
                domClass.remove( this.damageNode, "br-valueChanged" );
            }
            else if( prop == "damage" )
            {
                this.damageNode.innerHTML = "" + val || "?" ;
                domClass.add( this.damageNode, "br-valueChanged" );
            }
        },
        _calcDamage : function( reslt )
        {
            if( reslt < 0 )
            {
                return 0;
            }
            else
            {
                return Math.max( 0, Math.floor( this.baseDamageControl.get( "value" ) / 2 + Math.floor( Math.min( reslt, 6 ) * this.baseDamageControl.get( "value" ) / 2 ) ) - this.armourControl.get( "value" ) );
            }
        },
        _calcDefenceDamage : function( reslt )
        {
            return this._calcDamage( -reslt - 1 );
        },
        _rollFx : function( finalValue, iter, prom )
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
        _resetDie : function( widg )
        {
            this.rollDieNode.innerHTML = '<i class="fa fa-cube"></i>';
            this.taskResultNode.innerHTML = "?";
            domClass.remove( this.taskResultNode, "br-taskFailed br-taskSucceeded" );
            if( widg && widg.get( "state" ).defence )
            {
                this.armourControl.set( "value", Controller.inPlayPane.getArmour().direct );
            }
        }
    } );
} );