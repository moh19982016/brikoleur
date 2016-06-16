/**
 * Object API to Usergrid. If .access_token is provided, includes that in the requests to Usergrid. Responses and errors
 * are handled as JSON. The .access_token can be (re)set at any time. We don't check for it; whoever instantiates this
 * class must obtain one first.
 *
 * @public Class
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/Deferred",
          "dojo/node!config",
          "app/primejunta/_base/json-request" ],
function( declare,
          lang,
          Deferred,
          config,
          jsonRequest )
{
    return declare( [], {
        mode : "user",
        access_token : "",
        serverPath : "/" + config.get( "usergrid" ).organizationName + "/" + config.get( "usergrid" ).applicationName,
        TOKEN_ENDPOINT : config.get( "usergrid" ).url + "/" + config.get( "usergrid" ).organizationName + "/" + config.get( "usergrid" ).applicationName + "/token",
        postscript : function( kwObj )
        {
            lang.mixin( this, kwObj );
        },
        /**
         * Creates object in collection with relationship connectionName (default "owns").
         */
        createObject : function( collectionName, data, connectionName )
        {
            connectionName = connectionName || "owns";
            return this.post( this.serverPath + "/users/me/" + connectionName + "/" + collectionName, data );
        },
        /**
         * Retrieves object objectId from collection collectionName.
         * * If connectionName is "public", gets it directly from the collection.
         * * If no objectId is specified, lists all objects in the connection.
         *
         * @param collectionName
         * @param objectId
         * @param connectionName
         */
        retrieveObjects : function( collectionName, objectId, connectionName )
        {
            connectionName = connectionName || "owns";
            var path = connectionName == "public" ? this.serverPath : "" + this.serverPath + "/users/me/" + connectionName + "/";
            path += collectionName;
            if( objectId )
            {
                path += "/" + objectId;
            }
            return this.get( path );
        },
        /**
         * Updates object objectId in collection collectionName with data, through connectionName (default "owns").
         *
         * @param collectionName
         * @param objectId
         * @param data
         * @param connectionName
         */
        updateObject : function( collectionName, objectId, data, connectionName )
        {
            connectionName = connectionName || "owns";
            return this.put( this.serverPath + "/users/me/" + connectionName + "/" + collectionName + "/" + objectId, data );
        },
        /**
         * Deletes object objectId from collection collectionName, through connectionName (default "owns").
         *
         * @param collectionName
         * @param objectId
         * @param connectionName
         */
        deleteObject : function( collectionName, objectId, connectionName )
        {
            connectionName = connectionName || "owns";
            return this.delete( this.serverPath + "/users/me/" + connectionName + "/" + collectionName + "/" + objectId );
        },
        /**
         * Creates connection between objectId and targetName with verb, through connectionName (default "owns").
         *
         * @param collectionName
         * @param objectId
         * @param targetName
         * @param verb
         * @param connectionName
         */
        connectObject : function( collectionName, objectId, targetName, verb, connectionName )
        {
            // TODO
        },
        /**
         * Removes connection between objectId and targetName with verb, through connectionName (default "owns").
         *
         * @param collectionName
         * @param objectId
         * @param targetName
         * @param verb
         * @param connectionName
         */
        disconnectObject : function( collectionName, objectId, targetName, verb, connectionName )
        {
            // TODO
        },
        /**
         * Lists connections for objectId in collectionName. If connectionName is specified, lists only the connections
         * matching it.
         *
         * @param collectionName
         * @param objectId
         * @param connectionName
         */
        getConnections : function( collectionName, objectId, connectionName )
        {
            // TODO
        },
        set : function( prop, val )
        {
            this[ prop ] = val;
        },
        /**
         * API level calls
         */
        post : function( path, data )
        {
            return this._makeRequest({
                path : path,
                method : "post",
                data : data
            });
        },
        get : function( path, data )
        {
            return this._makeRequest({
                path : path,
                method : "get",
                data : data
            });
        },
        put : function( path, data )
        {
            return this._makeRequest({
                path : path,
                method : "put",
                data : data
            });
        },
        del : function( path, data )
        {
            return this._makeRequest({
                path : path,
                method : "del",
                data : data
            });
        },
        refreshAccessToken : function()
        {
            return jsonRequest.post( this.TOKEN_ENDPOINT, {
                grant_type : "client_credentials",
                client_id : config.get( "usergrid" ).clientId,
                client_secret : config.get( "usergrid" ).clientSecret
            } ).then( lang.hitch( this, function( resp )
            {
                this.access_token = resp.access_token;
                return new Deferred().resolve();
            } ) )
        },
        _makeRequest : function( req )
        {
            var prom = req.promise || new Deferred();
            req.promise = prom;
            var headers = {};
            if( this.access_token )
            {
                headers.Authorization = "Bearer " + this.access_token;
            }
            jsonRequest[ req.method ]( config.get( "usergrid" ).url + req.path, req.data, headers ).then(
                lang.hitch( this, this._handleResponse, req ),
                lang.hitch( this, this._handleError, req ) );
            return prom;
        },
        _handleResponse : function( req, resp )
        {
            req._attempted = false;
            req.promise.resolve( resp );
        },

        _handleError : function( req, err )
        {
            if( req._attempted )
            {
                console.log( "Already attempted, rejecting promise." );
                req.promise.reject( err );
            }
            else if( err.response.status == 401 && this.mode == "application" )
            {
                req._attempted = true;
                this.refreshAccessToken().then( lang.hitch( this, this._makeRequest, req ) );
            }
            else
            {
                req.promise.reject( err );
            }
        }
    } );
} );