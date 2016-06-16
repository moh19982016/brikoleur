define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "./_PureJsonClientBase" ],
function( declare,
          lang,
          _PureJsonClientBase )
{
    return declare( [ _PureJsonClientBase ], {
        createObject : function( collectionName, objectData, connectionName )
        {
            return this.call( {
                action_str : "create",
                data_type : "object",
                request_map : {
                    collection_name : collectionName,
                    object_data : objectData,
                    connection_name : connectionName || false
                }
            } );
        },
        retrieveObjects : function( collectionName, objectId, connectionName )
        {
            return this.call( {
                action_str : "retrieve",
                data_type : "object",
                request_map : {
                    collection_name : collectionName,
                    object_id : objectId,
                    connection_name : connectionName || false
                }
            } );
        },
        updateObject : function( collectionName, objectId, objectData, connectionName )
        {
            return this.call( {
                action_str : "update",
                data_type : "object",
                request_map : {
                    collection_name : collectionName,
                    object_id : objectId,
                    object_data : objectData,
                    connection_name : connectionName || false
                }
            } );
        },
        deleteObject : function( collectionName, objectId, connectionName )
        {
            return this.call( {
                action_str : "delete",
                data_type : "object",
                request_map : {
                    collection_name : collectionName,
                    object_id : objectId,
                    connection_name : connectionName || false
                }
            } );
        }
    } );
});