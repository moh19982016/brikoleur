/**
 * Base request handler class. Looks up the request handler from urlMap, and adds a few built-in ones:
 *
 * * *.html - serves static HTML page from app-client
 * * app-client/** - serves static resource from app-client
 * * app/** - serves static resource from app
 * * dojo/** - serves static resource from Dojo directory
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/Deferred",
         "dojo/node!url",
         "dojo/node!config",
         "./log",
         "./util" ],
function( declare,
          lang,
          Deferred,
          url,
          config,
          log,
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
                            lang.hitch( this, this.writeResponse, req, resp ) );
                    } ),
                    lang.hitch( this, this.handleError, req, resp ) );
            }
            else
            {
                this._getHandlerFor( req.url )( req ).then(
                    lang.hitch( this, this.writeResponse, req, resp ),
                    lang.hitch( this, this.handleError, req, resp ) );
            }
        },
        serveHtmlPage : function( req )
        {
            return util.getStream( "app-client" + req.url );
        },
        serveDojoResource : function( req )
        {
            var segm = req.url.substring( "/dojo".length );
            if( segm.indexOf( '?' ) != -1 )
            {
                segm = segm.substring( 0, segm.indexOf( '?' ) );
            }
            return this._serveStaticResource( config.get( "paths" ).dojo + segm );
        },
        serveClientResource : function( req )
        {
            return this._serveStaticResource( "app-client" + req.url.substring( "/app-client".length ) );
        },
        serveSharedResource : function( req )
        {
            return this._serveStaticResource( "app" + req.url.substring( "/app".length ) );
        },
        _serveStaticResource : function( path )
        {
            return util.getStream( path ).then( lang.hitch( this, function( reslt )
            {
                return new Deferred().resolve( reslt );
            }),
            lang.hitch( this, function()
            {
                return new Deferred().reject( { "status" : 404, "message" : "not_found" } );
            }));
        },
        defaultRequestHandler : function( req )
        {
            return new Deferred().resolve( {
                body : util.getErrorMessage( req, 404, "not_found", "not_found" )
            } );
        },
        writeResponse : function( req, resp, message )
        {
            message.body = message.body || {};
            var logList = [].concat( ( req.log_list || [] ) ).concat( ( message.body.log_list || [] ) );
            log.writeLog( logList );
            message.body.log_list = logList;
            util.writeResponse( resp, message );
        },
        handleError : function( req, resp, err )
        {
            log.writeLog( [].concat( ( req.log_list || [] ) ).concat( ( message.log_list || [] ) ) );
            if( err && err.status )
            {
                // this was a call for a static resource, not an API call
                util.writeResponse( resp, { body : err.message, status : err.status } );
            }
            else if( err && err instanceof Array )
            {
                util.writeResponse( resp, { body : util.getResponseMessage( req, false, err, true ) } );
            }
            else
            {
                util.writeResponse( resp, { body : util.getErrorMessage( req, 400, "bad_request", "bad_request" ) } );
            }
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