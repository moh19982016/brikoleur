define([ "dojo/_base/declare", "dojo/_base/array", "dojo/store/Memory" ], function( declare, array, Memory ) {
    return declare([ Memory ], {
        filter : [],
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
        }
    });
});