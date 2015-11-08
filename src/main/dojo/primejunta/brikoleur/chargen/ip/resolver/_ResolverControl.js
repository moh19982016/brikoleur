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
                this.taskResultNode.innerHTML = result;
                if( this._baseDamage )
                {
                    this.set( "damage", this._calcDamage( result ) );
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
                this._baseDamage = val;
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
            if( reslt < -1 )
            {
                return 0;
            }
            else
            {
                return this._baseDamage + Math.floor( Math.min( reslt, 6 ) * this._baseDamage / 2 );
            }
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
        _resetDie : function()
        {
            this.rollDieNode.innerHTML = '<i class="fa fa-cube"></i>';
            this.taskResultNode.innerHTML = "?";
            this.set( "base-damage", this._baseDamage || null );
        }
    } );
} );