define([ "dojo/_base/lang", "dojo/on", "dijit/Tooltip" ],
function( lang, on, Tooltip )
{
    return {
        listToStoreData : function( list )
        {
            for( var i = 0; i < list.length; i++ )
            {
                var cur = list[ i ];
                cur.id = cur.name;
            }
            return list;
        },
        showWarning : function( warning, aroundNode, aroundDir )
        {
            Tooltip.show( warning, aroundNode, aroundDir || [ "before", "above", "below", "after" ] );
            setTimeout( lang.hitch( this, function()
            {
                on.once( document.body, "click", lang.hitch( this, function()
                {
                    Tooltip.hide( aroundNode );
                }));
            }), 1 );
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
        },
        getProperties : function( prop, controls, self, recurse )
        {
            var out = [];
            for( var i = 0; i < controls.length; i++ )
            {
                if( controls[ i ] !== self )
                {
                    out.push( controls[ i ].get( prop ) );
                    if( recurse && controls[ i ].controls )
                    {
                        out = out.concat( this.getProperties( prop, controls[ i ].controls, self, recurse ) );
                    }
                }
            }
            return out;
        },
        countItems : function( controls )
        {
            var n = 0;
            for( var i = 0; i < controls.length; i++ )
            {
                n += controls[ i ].countItems();
            }
            return n;
        }
    }
});
