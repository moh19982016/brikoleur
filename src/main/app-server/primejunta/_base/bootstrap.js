/**
 * Bootstrap which sets up and starts an HTTP server, using the class defined in serverConfig.server.requestHandlerClass
 * as the request handler.
 *
 * @public void
 */
 require([ "dojo/node!config" ], function( config )
 {
    require([ "dojo/_base/lang",
              config.get( "server" ).requestHandlerClass,
              "dojo/node!http" ],
    function( lang,
              RequestHandler,
              http )
    {
        var handler = new RequestHandler();
        var server = http.createServer( lang.hitch( handler, handler.handleRequest ) );
        server.listen( config.get( "server" ).port );
        console.log( "Server listening at http://127.0.0.1:" + config.get( "server" ).port );
    });
 });
