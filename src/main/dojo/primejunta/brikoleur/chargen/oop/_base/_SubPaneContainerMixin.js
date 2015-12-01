/**
 * Mixin which adds features for handling subpanes, such as used for ohun and powers.
 *
 * @public Mixin
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/_base/array",
          "dojo/topic",
          "./../../data/traits/_common",
          "./FilteringMemory",
          "./../../_base/util" ],
function( declare,
          lang,
          array,
          topic,
          _common,
          FilteringMemory,
          util )
{
    return declare( [], {
        /**
         * Initialize .controls and ._store, then ._setupCommonFeatures (see), and subscribe to .selectedMasterItemTopic
         * to .setupSubPanes.
         *
         * @public void
         */
        postCreate : function()
        {
            this.controls = [];
            this._store = new FilteringMemory( { data : util.listToStoreData( this.data.list ) } );
            this._setupCommonFeatures();
            this.own( this._store,
            topic.subscribe( this.selectedMasterItemTopic, lang.hitch( this, this.setupSubPanes ) ) );
        },
        /**
         * If synthetic, do nothing (as it was called by .setState, which will subsequently set up its own sub-panes).
         * Else iterate through features: check if we already have the matching feature pane, and if not, look up the
         * data for it in ._store, and call .addFeature on it + the looked-up data to create a sub-pane.
         *
         * @param features
         * @param synthetic
         * @public void
         */
        setupSubPanes : function( /* string[] */ features, /* boolean */ synthetic )
        {
            if( synthetic )
            {
                return;
            }
            var values = util.getProperties( this.controls, { property : "key" } );
            for( var i = 0; i < features.length; i++ )
            {
                if( features[ i ] && array.indexOf( values, features[ i ] ) == -1 )
                {
                    var items = this._store.get( features[ i ] )[ this.featureProperty ];
                    if( items )
                    {
                        for( var j = 0; j < items.length; j++ )
                        {
                            this.addFeature( {
                                key : features[ i ],
                                value : features[ i ],
                                data : items[ j ]
                            } );
                        }
                    }
                }
            }
        },
        /**
         * Looks up .featureProperty from _common (the data object containing common properties for all traits). Then
         * calls .addFeature on each of them.
         *
         * @private void
         */
        _setupCommonFeatures : function()
        {
            for( var i = 0; i < ( _common[ this.featureProperty ] || [] ).length; i++ )
            {
                this.addFeature( {
                    key : "_common",
                    value : "_common",
                    data : _common[ this.featureProperty ][ i ]
                } );
            }
        },
        /**
         * Clear, then .addControl for each member of state. If we have any controls, .maximize().
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object[] */ state )
        {
            this.clear();
            for( var i = 0; i < state.length; i++ )
            {
                this.addControl( {
                    data : this._lookup( state[ i ].key, state[ i ].name ),
                    key : state[ i ].key,
                    value : state[ i ].value
                } ).set( "state", state[ i ] );
            }
            if( this.controls.length > 0 )
            {
                this.maximize();
            }
        },
        /**
         * Looks up data matching name for trait matching key. If it's not found in ._store, tries to find it in
         * _common. Uses ._rLookup to search the data.
         *
         * @param key - name of the trait to which the property belongs
         * @param name - name of the property
         * @private Object
         */
        _lookup : function( /* string */ key, /* string */ name )
        {
            var itm = this._store.get( key );
            var reslt;
            if( itm && itm[ this.featureProperty ] )
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
        /**
         * Looks for data object matching name in item[ this.featureProperty ].
         *
         * @param item
         * @param name
         * @private Object
         */
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
    } );
} );