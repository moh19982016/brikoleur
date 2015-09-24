define([ "dojo/_base/declare",
        "dojo/store/Memory",
        "./../../_base/util",
        "./../../_base/_FieldBase",
        "dijit/form/Select" ],
function( declare,
          Memory,
          util,
          _FieldBase,
          Select )
{
    return declare([ _FieldBase ], {
        inputWidget : Select,
        genders : [
            "genderless",
            "intersex",
            "mars",
            "mars-double",
            "mars-stroke",
            "mars-stroke-h",
            "mars-stroke-v",
            "mercury",
            "neuter",
            "transgender-alt",
            "venus",
            "venus-double",
            "venus-mars"
        ],
        makeInput : function()
        {
            var opts = [];
            var store = new Memory({ data : util.listToStoreData( this.genders ), getLabel : function( item )
            {
                return '<i class="fa fa-' + item.id + '"></i>';
            }});
            this._input = new Select({ name : this.name, store : store } ).placeAt( this.controlNode );
        }
    });
});