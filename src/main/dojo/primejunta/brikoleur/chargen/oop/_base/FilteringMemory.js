/**
 * Extends Memory with the possibility of setting a filter which will exclude any matches from resultsets.
 *
 * @public Class
 */
define([ "dojo/_base/declare",
         "dojo/_base/array",
         "dojo/store/Memory" ],
function( declare,
          array,
          Memory )
{
    return declare([ Memory ], {
        /**
         * Array of ID's to be excluded from resultsets. Set directly to update.
         *
         * @public string[]
         */
        filter : [],
        /**
         * Inherited, then filter resultset by .filter.
         *
         * @public Object[]
         */
        query : function()
        {
            var results = this.inherited( arguments );
            var out = [];
            for( var i = 0; i < results.length; i++ )
            {
                if( array.indexOf( this.filter, results[ i ].id ) == -1 )
                {
                    out.push( results[ i ] );
                }
            }
            return out;
        },
        /**
         * Returns item.name. This method is required for dijit/form/Select so we added it here for convenience.
         *
         * @param item
         * @public string
         */
        getLabel : function( /* Object */ item )
        {
            return item.name;
        }
    });
});