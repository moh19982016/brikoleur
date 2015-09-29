define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/topic",
        "./../../data/traits/_common",
        "./../_base/FilteringMemory",
        "./util" ],
function( declare,
          lang,
          array,
          topic,
          _common,
          FilteringMemory,
          util )
{
    return declare([ ], {

        postCreate : function()
        {
            this.controls = [];
            this._store = new FilteringMemory({ data : util.listToStoreData( this.data.list ) });
            this._setupCommonFeatures();
            this.own( this._store, topic.subscribe( this.selectedMasterItemTopic, lang.hitch( this, this.setupSubPanes ) ) );
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
        _setupCommonFeatures : function()
        {
            for( var i = 0; i < ( _common[ this.featureProperty ] || [] ).length; i++ )
            {
                this.featureAdded({
                    key : "_common",
                    value : "_common",
                    data : _common[ this.featureProperty ][ i ]
                });
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
            var reslt;
            if( itm && itm[ this.featureProperty ])
            {
                reslt = this._rLookup( itm, name );
            }
            if( !reslt && _common[ this.featureProperty ] )
            {
                reslt = this._rLookup( _common, name );
            }
            if( reslt )
            {
                return reslt;
            }
            else
            {
                throw( "Couldn't find feature [" + key + "], [" + name + "]. Incompatible data?" );
            }
        },
        _rLookup : function( item, name )
        {
            var items = item[ this.featureProperty ];
            for( var i = 0; i < items.length; i++ )
            {
                if( items[ i ].name == name )
                {
                    return items[ i ];
                }
            }
        }
    });
});