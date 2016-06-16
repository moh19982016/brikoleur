/**
 * Thin interface for storing character data in localStorage as JSON objects. There are two stores, prefixed with
 * different strings; it will only operate on data behind these prefixes so it won't interfere with other uses of
 * localStorage.
 *
 * @public Class
 */
define([ "dojo/_base/array",
         "dojo/json" ],
function( array,
          json )
{
    return {
        /**
         * Store name. Everything will be stored in .localStorage behind this prefix.
         *
         * @final
         * @public string
         */
        STORE_NAME : "primejunta.brikoleur.store",
        /**
         * Settings store name. Everything will be stored in .localStorage behind this prefix.
         *
         * @final
         * @public string
         */
        SETTINGS_NAME : "primejunta.brikoleur.settings",
        /**
         * If name is in list, return true.
         *
         * @param name
         * @public boolean
         */
        nameInUse : function( /* string */ name )
        {
            return array.indexOf( this.list(), name ) != -1;
        },
        /**
         * Stores obj as JSON string so it can be retrieved with name as key.
         *
         * @param name
         * @param obj
         * @public void
         */
        save : function( /* string */ name, /* Object */ obj )
        {
            localStorage[ this.STORE_NAME + "." + name ] = json.stringify( obj );
        },
        /**
         * Serves data matching name from store as Object, or false if no match is found.
         *
         * @param name
         * @public Object
         */
        load : function( /* string */ name )
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
        /**
         * Returns list of all names stored in .localStorage, prefixed with STORE_NAME.
         *
         * @public string[]
         */
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
        /**
         * Deletes data matching name from .localStorage.
         *
         * @param name
         * @public void
         */
        remove : function( /* string */ name )
        {
            delete localStorage[ this.STORE_NAME + "." + name ];
        },
        /**
         * Stores property prop with value val in localStorage prefixed with SETTINGS_NAME.
         *
         * @param prop
         * @param val
         * @public void
         */
        set : function( prop, val )
        {
            localStorage[ this.SETTINGS_NAME + "." + prop ] = val;
        },
        /**
         * Returns property prop from localStorage.
         *
         * @param prop
         * @public string
         */
        get : function( prop )
        {
            return localStorage[ this.SETTINGS_NAME + "." + prop ];
        }
    };
});