define([ "dojo/_base/lang", "dojo/_base/array", "dojo/json" ],
function( lang, array, json )
{
    return {
        STORE_NAME : "primejunta.brikoleur.store",
        nameInUse : function( name )
        {
            return array.indexOf( this.list(), name ) != -1;
        },
        save : function( name, obj )
        {
            localStorage[ this.STORE_NAME + "." + name ] = json.stringify( obj );
        },
        load : function( name )
        {
            var rec = localStorage[ this.STORE_NAME + "." + name ];
            if( !rec )
            {
                return false;
            }
            else
            {
                return json.parse( rec );
            }
        },
        list : function()
        {
            var keys = Object.keys( localStorage );
            var out = [];
            for( var i = 0; i < keys.length; i++ )
            {
                if( keys[ i ].indexOf( this.STORE_NAME ) == 0 )
                {
                    out.push( keys[ i ].substring( this.STORE_NAME.length + 1 ) );
                }
            }
            return out;
        },
        remove : function( name )
        {
            delete this.store[ name ];
        }
    };
});