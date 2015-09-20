define([ "dojo/_base/lang", "dojo/on", "dijit/Tooltip" ],
function( lang, on, Tooltip )
{
    return {
        listToOptions : function( list )
        {
            var out = [];
            for( var i = 0; i < list.length; i++ )
            {
                out.push({ value : list[ i ].name, label : list[ i ].name });
            }
            return out;
        },
        listToStoreData : function( list )
        {
            for( var i = 0; i < list.length; i++ )
            {
                var cur = list[ i ];
                cur.id = cur.name;
            }
            return list;
        },
        showWarning : function( warning, aroundNode )
        {
            Tooltip.show( warning, aroundNode );
            on.once( document.body, "click", lang.hitch( this, function()
            {
                Tooltip.hide( aroundNode );
            }));
        },
        itemInArray : function( array, item, isContainer )
        {
            for( var i = 0; i < array.length; i++ )
            {
                var cItem = isContainer ? array[ i ].item.id : array[ i ].id;
                if( cItem == item.id )
                {
                    return true;
                }
            }
            return false;
        },
        get : function( prop, selector, store )
        {
            if( prop == "value" )
            {
                return this.get( "item", selector, store ).id;
            }
            else if( prop == "item" )
            {
                var val = selector.get( "value" );
                return store.get( val ) || { id : val, name : val };
            }
            else
            {
                return false;
            }
        }
    }
});
