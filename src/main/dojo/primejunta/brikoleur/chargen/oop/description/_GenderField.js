define([ "dojo/_base/declare",
        "./../../_base/_FieldBase",
        "dijit/form/Select" ],
function( declare,
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
        postCreate : function()
        {
            var opts = [];
            for( var i = 0; i < this.genders.length; i++ )
            {
                opts.push({ value : "" + i, label : "<i class='fa fa-" + this.genders[ i ] + "'></i>" });
            }
            this._input.set( "options", opts );
        }
    });
});