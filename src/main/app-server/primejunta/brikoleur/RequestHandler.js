define([ "dojo/_base/declare",
         "../_base/_RequestHandlerBase",
         "./url-handler" ],
function( declare,
          _RequestHandlerBase,
          urlHandler )
{
    return declare([ _RequestHandlerBase ], {
        urlMap : urlHandler
    });
});