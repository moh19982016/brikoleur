define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/string",
         "dojo/Deferred",
         "dojo/node!url",
         "./util" ],
function( declare,
          lang,
          string,
          Deferred,
          url,
          util )
{
    return declare([], {
        urlMap : {},
        _urlRegExps : {},
        postscript : function( kwObj )
        {
            lang.mixin( this, kwObj );
            this.urlMap[ "*.html" ] = lang.hitch( this, this.serveHtmlPage );
            this.urlMap[ "app-client/**" ] = lang.hitch( this, this.serveClientResource );
            this.urlMap[ "app/**" ] = lang.hitch( this, this.serveSharedResource );
            this.urlMap[ "dojo/**" ] = lang.hitch( this, this.serveDojoResource );
        },
        handleRequest : function( req, resp )
        {
            // maybe do logging here?
            if( req.headers[ "content-type" ] == "application/json" )
            {
                util.readBody( req ).then(
                    lang.hitch( this, function( jsonMessage )
                    {
                        req._jsonMessage = jsonMessage;
                        this._getHandlerFor( req.url )( req ).then(
                            lang.hitch( this, this.writeResponse, resp ),
                            lang.hitch( this, this.handleError, resp ) );
                    } ),
                    lang.hitch( this, this.handleError, resp ) );
            }
            else
            {
                this._getHandlerFor( req.url )( req ).then(
                    lang.hitch( this, this.writeResponse, resp ),
                    lang.hitch( this, this.handleError, resp ) );
            }
        },
        defaultRequestHandler : function( req )
        {
            return new Deferred().resolve( {
                body : {
                    status : 404,
                    status_message : "404 Not Found"
                },
                status : 404
            } );
        },
        serveHtmlPage : function( req )
        {
            var prom = new Deferred();
            require( [ "dojo/text!" + this._parseResourcePath( this._getPath( req.url ) ) ], lang.hitch( this, function( resource )
            {
                prom.resolve( {
                    body : string.substitute( resource, this._htmlProperties ),
                    contentType : "text/html"
                } );
            } ) );
            return prom;
        },
        serveDojoResource : function( req )
        {
            var segm = req.url.substring( "/dojo".length );
            if( segm.indexOf( '?' ) != -1 )
            {
                segm = segm.substring( 0, segm.indexOf( '?' ) );
            }
            return util.getStream( serverConfig.paths.dojo + segm );
        },
        serveClientResource : function( req )
        {
            return util.getStream( "app-client" + req.url.substring( "/app-client".length ) );
        },
        serveSharedResource : function( req )
        {
            return util.getStream( "app" + req.url.substring( "/app".length ) );
        },
        writeResponse : function( resp, message )
        {
            // maybe do some logging here?
            util.writeResponse( resp, message );
        },
        handleError : function( resp, err )
        {

            console.log( "IN ERROR HANDLER", err );

            // maybe do some logging here also?
            util.writeResponse( resp, { status : 400, body : { "error" : "bad_request" } } );
        },
        _getHandlerFor : function( url )
        {
            var path = this._getPath( url );
            return ( this.urlMap[ path ] || this._matchUrl( path ) || this.defaultRequestHandler );
        },
        _parseResourcePath : function( url )
        {
            return "app-client/" + url;
        },
        _parseContentType : function( url )
        {
            var suff = url.substring( url.lastIndexOf( "." ) + 1 );
            return this.contentTypes[ suff ] || "text/plain";
        },
        _getPath : function( url )
        {
            var path = url.substring( 1 );
            if( path.indexOf( '?' ) != -1 )
            {
                path = path.substring( 0, path.indexOf( '?' ) );
            }
            if( path.indexOf( '#' ) != -1 )
            {
                path = path.substring( 0, path.indexOf( '#' ) );
            }
            return path;
        },
        _matchUrl : function( url )
        {
            for( var o in this.urlMap )
            {
                if( this._match( o, url ) )
                {
                    return this.urlMap[ o ];
                }
            }
            return false;
        },
        _match : function( patt, url )
        {
            var re = this._getRegExp( patt );
            if( re )
            {
                return url.match( re ) == url;
            }
            else
            {
                return false;
            }
        },
        _getRegExp : function( patt )
        {
            if( this._urlRegExps[ patt ] )
            {
                return this._urlRegExps[ patt ];
            }
            else
            {
                var re = new RegExp( patt.replace( /\*\*/g, ".+" ).replace( /\*/g, "\\w+" ) );
                this._urlRegExps[ patt ] = re;
                return re;
            }
        }
    });
});