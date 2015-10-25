define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dojo/dom-class",
          "./../../_base/_FeatureControlBase",
          "dojo/text!./templates/_TrainingControl.html" ],
function( declare,
          lang,
          topic,
          domClass,
          _FeatureControlBase,
          template )
{
    var Constr = declare( [ _FeatureControlBase ], {
        symbol : "Ⓚ",
        trained : true,
        SYMBOLS : {
            UNTRAINED : "Ⓤ",
            L0 : "Ⓚ",
            L1 : "Ⓣ",
            L2 : "Ⓢ"
        },
        templateString : template,
        postMixInProperties : function()
        {
            this.symbol = this.trained ? this.SYMBOLS[ "L" + this.level ] : this.SYMBOLS.UNTRAINED;
        },
        postCreate : function()
        {
            this.inherited( arguments );
            if( !this.trained )
            {
                domClass.add( this.clickNode, "br-untrainedSkill" );
            }
            this.childConstructor = Constr;
            this.own( topic.subscribe( "/ResolveTask/", lang.hitch( this, this._setAppearance ) ) );
        },
        pleaseResolveTask : function()
        {
            topic.publish( "/ResolveTask/", this );
        },
        _setState : function( state )
        {
            this.inherited( arguments );
        },
        _setChildState : function( state )
        {
            if( state.value )
            {
                this.createChildControl( {} ).set( "state", state );
            }
        },
        _setAppearance : function( widg )
        {
            if( widg == this )
            {
                domClass.add( this.clickNode, "br-bonusSelected" );
            }
            else if( widg instanceof Constr )
            {
                domClass.remove( this.clickNode, "br-bonusSelected" );
            }
        }
    } );
    return Constr;
} );