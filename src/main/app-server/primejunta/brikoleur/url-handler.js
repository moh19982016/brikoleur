define([ "dojo/_base/lang",
         "../_base/PureJsonUsergridClient",
         "../_base/UserManager"],
function( lang,
          PureJsonUsergridClient,
          UserManager )
{
    var mgr = new UserManager();
    var ugc = new PureJsonUsergridClient();
    return {
        "authenticate" : lang.hitch( mgr, mgr.authenticate ),
        "resetpw.html" : lang.hitch( mgr, mgr.serveResetPasswordForm ),
        "pirates" : lang.hitch( ugc, ugc.handleRequest )
    };
});