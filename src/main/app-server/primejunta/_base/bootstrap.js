/**
 * Bootstrap which sets up and starts an HTTP server, using the class defined in serverConfig.server.requestHandlerClass
 * as the request handler.
 *
 * @public void
 */
require([ "dojo/_base/lang",
          serverConfig.server.requestHandlerClass,
          "dojo/node!http" ],
function( lang,
          RequestHandler,
          http )
{
    var handler = new RequestHandler();
    var server = http.createServer( lang.hitch( handler, handler.handleRequest ) );
    server.listen( serverConfig.server.port );
    console.log( "Server listening at http://127.0.0.1:" + serverConfig.server.port );
});
