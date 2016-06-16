define([ "dojo/_base/lang",
         "../_base/JsonPureUsergridClient",
         "../_base/JsonPureUserManager"],
function( lang,
          JsonPureUsergridClient,
          JsonPureUserManager )
{
    var mgr = new JsonPureUserManager();
    var ugc = new JsonPureUsergridClient();
    return {
        "authenticate" : lang.hitch( mgr, mgr.authenticate ),
        "resetpw.html" : lang.hitch( mgr, mgr.serveResetPasswordForm ),
        "pirates" : lang.hitch( ugc, ugc.handleRequest )
    };
});