define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/topic",
        "./../_base/FilteringMemory",
        "./../../_base/util" ],
function( declare,
          lang,
          array,
          topic,
          FilteringMemory,
          util )
{
    return declare([ ], {

        postCreate : function()
        {
            this.controls = [];
            this._store = new FilteringMemory({ data : util.listToStoreData( this.data.list ) });
            topic.subscribe( this.selectedMasterItemTopic, lang.hitch( this, this.setupSubPanes ) );
        },
        setupSubPanes : function( features, synthetic )
        {
            if( synthetic )
            {
                return;
            }
            var values = util.getProperties( this.controls, { property : "key" });
            for( var i = 0; i < features.length; i++ )
            {
                if( features[ i ] && array.indexOf( values, features[ i ] ) == -1 )
                {
                    var items = this._store.get( features[ i ] )[ this.featureProperty ];
                    if( items )
                    {
                        for( var j = 0; j < items.length; j++ )
                        {
                            this.featureAdded({
                                key : features[ i ],
                                value : features[ i ],
                                data : items[ j ]
                            });
                        }
                    }
                }
            }
        },
        _setState : function( state )
        {
            this.clear();
            for( var i = 0; i < state.length; i++ )
            {
                this.addControl({ data : this._lookup( state[ i ].key, state[ i ].name ), key : state[ i ].key, value : state[ i ].value }).set( "state", state[ i ] );
            }
            if( this.controls.length > 0 )
            {
                this.maximize();
            }
        },
        _lookup : function( key, name )
        {
            var itm = this._store.get( key );
            if( itm && itm[ this.featureProperty ])
            {
                var items = itm[ this.featureProperty ];
                for( var i = 0; i < items.length; i++ )
                {
                    if( items[ i ].name == name )
                    {
                        return items[ i ];
                    }
                }
            }
            throw( "Couldn't find feature [" + key + "], [" + name + "]. Incompatible data?" );
        }
    });
});