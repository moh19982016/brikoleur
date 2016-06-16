define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/string",
         "dojo/node!url",
         "./util" ],
function( declare,
          lang,
          string,
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
            if( req.headers[ "content-type" ] == "application/json" )
            {
                util.readBody( req ).then( lang.hitch( this, function( jsonMessage )
                {
                    this._getHandlerFor( req.url )( req, resp, jsonMessage );
                }), lang.hitch( this, this.handleError ));
            }
            else
            {
                this._getHandlerFor( req.url )( req, resp );
            }
        },
        defaultRequestHandler : function( req, resp )
        {
            util.writeErrorResponse( resp, "404 Not Found", 404 );
        },
        serveHtmlPage : function( req, resp )
        {
            require( [ "dojo/text!" + this._parseResourcePath( this._getPath( req.url ) ) ], lang.hitch( this, function( resource )
            {
                util.writeResponse( resp, string.substitute( resource, this._htmlProperties ), "text/html" );
            } ) );
        },
        serveDojoResource : function( req, resp )
        {
            var segm = req.url.substring( "/dojo".length );
            if( segm.indexOf( '?' ) != -1 )
            {
                segm = segm.substring( 0, segm.indexOf( '?' ) );
            }
            util.serveStaticResource( serverConfig.paths.dojo + segm, resp );
        },
        serveClientResource : function( req, resp )
        {
            util.serveStaticResource( "app-client" + req.url.substring( "/app-client".length ), resp );
        },
        serveSharedResource : function( req, resp )
        {
            util.serveStaticResource( "app" + req.url.substring( "/app".length ), resp );
        },
        handleError : function( err )
        {
            util.writeErrorResponse( resp, "400 Bad Request" );
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