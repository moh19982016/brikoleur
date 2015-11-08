/**
 * Inventory item control for weapons. Includes suitable weapon type selector and fields for damage and range.
 *
 * @private Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/topic",
          "dojo/store/Memory",
          "./../../data/knacks",
          "./../_base/util",
          "./_ItemControl",
          "dojo/text!./templates/_WeaponControl.html" ],
function( declare,
          lang,
          on,
          topic,
          Memory,
          knacks,
          util,
          _ItemControl,
          template )
{
    return declare( [ _ItemControl ], {
        /**
         * Item type, one of LR, MR, HR, T, M.
         *
         * @public string
         */
        itemType : "LR",
        /**
         * Level.
         *
         * @public int
         */
        level : 0,
        /**
         * Yep it's a weapon.
         *
         * @final
         * @public string
         */
        type : "weapon",
        /**
         * Base damage values for weapons of different types.
         *
         * @final
         * @public Object
         */
        damageMap : {
            LR : 3,
            MR : 4,
            HR : 10,
            T : 2,
            M : 2
        },
        /**
         * Base range values for weapons of different types.
         *
         * @final
         * @public Object
         */
        rangeMap : {
            LR : "S",
            MR : "L",
            HR : "X",
            T : "S",
            M : "N/A"
        },
        trainingMap : {
            LR : "Light Ranged Weapons",
            MR : "Medium Ranged Weapons",
            HR : "Heavy Ranged Weapons",
            T : "Thrown Weapons",
            M : "Melee Weapons"
        },
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
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
         * Set damage and range based on defaults, using _ItemControl::setField, and update level and itemType.
         *
         * @public void
         */
        recalcValues : function()
        {
            this.setField( "damageInput",
            this._calcDamage( this.itemTypeSelect.get( "value" ), this.levelInput.get( "value" ) ),
            this._calcDamage( this.itemType, this.level ) );
            this.setField( "rangeSelect",
            this.rangeMap[ this.itemTypeSelect.get( "value" ) ],
            this.rangeMap[ this.itemType ] );
            this.level = this.levelInput.get( "value" );
            this.itemType = this.itemTypeSelect.get( "value" );
        },
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
         * If we're in combat, publish a topic with data which will be picked up by the task resolver.
         *
         * @public void
         */
        pleaseAttack : function()
        {
            if( Controller.inPlayPane.inCombat )
            {
                topic.publish( "/PleaseAttack/", this.get( "state" ) );
            }
        },
        updateWeaponTypes : function()
        {
            var wt = this.itemTypeSelect.get( "value" );
            var cKnack = wt.charAt( 1 ) == 'R' ? "Ranged Combat" : "Close Combat";
            var types = util.queryData( knacks, [ cKnack, this.trainingMap[ wt ] ], "name" );
            types = types.concat( util.queryData( Controller.get( "state" ).knacks, [ cKnack, this.trainingMap[ wt ] ], "value" ) );
            types.sort();
            types = util.removeDuplicates( types );
            var data = util.listToStoreData( types );
            this.specialisationInput.set( "store", new Memory({ data : data }));
        },
        /**
         * Add .itemType, .damage, and .range to inherited value and return it.
         *
         * @private Object
         */
        _getValue : function()
        {
            var value = this.inherited( arguments );
            value.itemType = this.itemTypeSelect.get( "value" );
            value.damage = this.damageInput.get( "value" );
            value.range = this.rangeSelect.get( "value" );
            value.specialisation = this.specialisationInput.get( "value" );
            return value;
        },
        /**
         * Set itemTypeSelect, damageInput, and rangeSelect from value, in addition to inherited.
         *
         * @param value
         * @private void
         */
        _setValue : function( /* Object */ value )
        {
            this.inherited( arguments );
            this.itemTypeSelect.set( "value", value.itemType );
            this.damageInput.set( "value", value.damage );
            this.rangeSelect.set( "value", value.range );
            this.specialisationInput.set( "value", value.specialisation );
            this.descriptionNode.innerHTML = value.specialisation + "/" + value.description;
        },
        /**
         * Adds level to damage from .damageMap and returns it.
         *
         * @param type
         * @param level
         * @private int
         */
        _calcDamage : function( /* string */ type, /* int */ level )
        {
            return ( level || 0 ) + this.damageMap[ type ];
        }
    } );
} );