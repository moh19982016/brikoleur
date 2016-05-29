/**
 * Stats pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dojo/dom-construct",
         "dojo/dom-geometry",
         "dojo/dom-class",
         "../../_base/_FeaturePaneBase",
         "../_base/_StatField",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          domConstruct,
          domGeometry,
          domClass,
          _FeaturePaneBase,
          _StatField,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.Numbers,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "dashboard",
        /**
         * Threshold for flipping layout from wide to narrow (px).
         *
         * @public int
         */
        threshold : 550,
        /**
         * Set up dynamic layout, which places Stamina to the right if there's room, everything top to bottom if not,
         * and then addField on all our stats with the starting default values.
         *
         * @public void
         */
        postCreate : function()
        {
            this.q1 = domConstruct.create( "div", { "class" : "br-formLayoutLeft" }, this.containerNode );
            this.q2 = domConstruct.create( "div", { "class" : "br-formLayoutRight" }, this.containerNode );
            domConstruct.create( "div", { "style" : "clear:both" }, this.containerNode );
            this.q3 = domConstruct.create( "div", { "class" : "br-formLayoutLeft" }, this.containerNode );
            this.q4 = domConstruct.create( "div", { "class" : "br-formLayoutRight" }, this.containerNode );
            domConstruct.create( "div", { "style" : "clear:both" }, this.containerNode );
            this.addField( "body", _StatField, { title : i18n.Body, value : 6, onChange : lang.hitch( this, this._recalcStamina ), cost : 1 }, this.q1 );
            this.addField( "mind", _StatField, { title : " + " + i18n.Mind, value : 6, onChange : lang.hitch( this, this._recalcStamina ), cost : 1  }, this.q2 );
            this.addField( "stamina", _StatField, { title : " = " + i18n.Stamina, value : 12, disabled : true, "class" : "br-stamina" }, this.q2 );
            this.addField( "armour", _StatField, { title : "" + i18n.Armour, value : 0, disabled : true }, this.q1 );
            this.addField( "aps", _StatField, { title : i18n.ActivePowerSlots, value : 2, cost : 4 }, this.q3 );
            this.addField( "os", _StatField, { title : i18n.OhunSlots, value : 2, cost : 4 }, this.q4 );
            this.own( topic.subscribe( "Controller.mainContainer-selectChild", lang.hitch( this, this.resize ) ) );
        },
        /**
         * Inherited, then resize to update the layout if needed.
         *
         * @public void
         */
        maximize : function()
        {
            this.inherited( arguments );
            setTimeout( lang.hitch( this, this.resize ), 1 );
        },
        /**
         * Add/remove formLayoutLeft and formLayoutRight classes to/from the layout nodes, if we're below/above
         * .threshold in content box width.
         *
         * @public void
         */
        resize : function()
        {
            if( domGeometry.getContentBox( this.containerNode ).w < this.threshold )
            {
                domClass.remove( this.q1, "br-formLayoutLeft" );
                domClass.remove( this.q2, "br-formLayoutRight" );
                domClass.remove( this.q3, "br-formLayoutLeft" );
                domClass.remove( this.q4, "br-formLayoutRight" );
            }
            else
            {
                domClass.add( this.q1, "br-formLayoutLeft" );
                domClass.add( this.q2, "br-formLayoutRight" );
                domClass.add( this.q3, "br-formLayoutLeft" );
                domClass.add( this.q4, "br-formLayoutRight" );
            }
        },
        /**
         * Sets states of controls from Object[].
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object[] */ state )
        {
            for( var prop in this._props )
            {
                for( var i = 0; i < state.length; i++ )
                {
                    if( state[ i ].name == prop )
                    {
                        this._props[ prop ].set( "state", state[ i ] );
                        break;
                    }
                }
            }
        },
        /**
         * Sums body and mind to get stamina.
         *
         * @private void
         */
        _recalcStamina : function()
        {
            this.set( "stamina", ( this.get( "body" ) || 0 ) + ( this.get( "mind" ) || 0 ) );
        }
    });
});