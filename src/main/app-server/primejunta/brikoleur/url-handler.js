define([ "dojo/_base/lang",
         "dojo/string",
         "../_base/PureJsonUsergridClient",
         "../_base/UserManager"],
function( lang,
          string,
          PureJsonUsergridClient,
          UserManager )
{
    var mgr = new UserManager();
    var ugc = new PureJsonUsergridClient();
    return {
        "register" : lang.hitch( mgr, mgr.register ),
        "login" : lang.hitch( mgr, mgr.login ),
        "resetpw" : lang.hitch( mgr, mgr.requestResetPassword ),
        "resetpw.html" : lang.hitch( mgr, mgr.serveResetPasswordForm ),
        "setpw" : lang.hitch( mgr, mgr.setPassword ),
        "pirates" : lang.hitch( ugc, ugc.handleRequest )
    };
});