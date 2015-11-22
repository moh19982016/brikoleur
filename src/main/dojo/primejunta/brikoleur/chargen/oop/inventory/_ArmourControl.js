/**
 * Inventory item control for Armour.
 *
 * @private Widget
 */
define( [ "dojo/_base/declare",
          "./_ItemControl",
          "dijit/form/RadioButton",
          "dojo/text!./templates/_ArmourControl.html" ],
function( declare,
          _ItemControl,
          RadioButton,
          template )
{
    return declare( [ _ItemControl ], {
        /**
         * Item type, one of L, M, H, P.
         *
         * @public string
         */
        itemType : "L",
        /**
         * Level.
         *
         * @public int
         */
        level : 0,
        /**
         * Base properties for armour of different types: direct, environmental, stamina penalty, movement penalty.
         *
         * @final
         * @public Object
         */
        armourMap : {
            L : [ 1, 1, 0 ],
            M : [ 4, 4, -1 ],
            H : [ 6, 6, -2 ],
            P : [ 6, 6, 0 ]
        },
        /**
         * Yep it's an armour.
         *
         * @final
         * @public string
         */
        type : "armour",
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * We don't display the type, so do nothing.
         *
         * @param type
         * @public void
         */
        displayType : function( /* string */ type )
        {
        },
        /**
         * Just .recalcValues and set .itemType to match the selection.
         *
         * @public void
         */
        onChangeType : function()
        {
            this.recalcValues();
            this.itemType = this.itemTypeSelect.get( "value" );
        },
        /**
         * Set directArmourInput, environmentalArmourInput, and movementPenaltyInput values with
         * _ItemControl::setField, then update level and itemType.
         *
         * @public void
         */
        recalcValues : function()
        {
            var ovals = this.armourMap[ this.itemType ] || [ - 1, - 1, - 1 ];
            var nvals = this.armourMap[ this.itemTypeSelect.get( "value" ) ];
            var nLvl = this.levelInput.get( "value" ) || 0;
            var oLvl = this.level;
            this.setField( "directArmourInput", nvals[ 0 ] + nLvl, ovals[ 0 ] + oLvl );
            this.setField( "environmentalArmourInput", nvals[ 1 ] + nLvl, ovals[ 1 ] + oLvl );
            this.setField( "movementPenaltyInput", nvals[ 2 ], ovals[ 2 ] );
            this.level = nLvl;
            this.itemType = this.itemTypeSelect.get( "value" );
        },
        /**
         * Adds itemType, direct, environmental, and movementPenalty to inherited value, and returns it.
         *
         * @private Object
         */
        _getValue : function()
        {
            var value = this.inherited( arguments );
            value.itemType = this.itemTypeSelect.get( "value" );
            value.direct = this.directArmourInput.get( "value" );
            value.environmental = this.environmentalArmourInput.get( "value" );
            value.movementPenalty = this.movementPenaltyInput.get( "value" );
            return value;
        },
        /**
         * Set itemType, direct, environmental, and movementPenalty from value.
         *
         * @param value
         * @private Object
         */
        _setValue : function( /* Object */ value )
        {
            this.inherited( arguments );
            this.itemTypeSelect.set( "value", value.itemType );
            this.directArmourInput.set( "value", value.direct );
            this.environmentalArmourInput.set( "value", value.environmental );
            this.movementPenaltyInput.set( "value", value.movementPenalty );
        }
    } );
} );