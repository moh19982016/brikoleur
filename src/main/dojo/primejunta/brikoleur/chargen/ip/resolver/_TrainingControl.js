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
    return declare( [ _FeatureControlBase ], {
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
            this.own( topic.subscribe( "/ResolveTask/", lang.hitch( this, this._setAppearance ) ) );
        },
        pleaseResolveTask : function( isAttack )
        {
            topic.publish( "/ResolveTask/", this, isAttack === true );
        },
        _setState : function( state )
        {
            this.inherited( arguments );
            if( this.state.type == "combat" )
            {
                domClass.add( this.domNode, "br-hideOutOfCombat" );
            }
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
            else if( widg instanceof this.parent.childConstructor )
            {
                domClass.remove( this.clickNode, "br-bonusSelected" );
            }
        }
    } );
} );