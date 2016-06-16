exports.server = {
    requestHandlerClass : "app-server/primejunta/brikoleur/RequestHandler",
    port : 8081
};
exports.paths = {
    dojo :  "/Users/psulonen/WebstormProjects/dojo-trunk"
};
exports.usergrid = {
    url : "http://192.168.0.66",
    applicationName : "brikoleur",
    applicationId : "98ac0126-2e1c-11e6-ba57-080027cf389a",
    organizationName : "udwc",
    organizationId : "834fdec4-2e11-11e6-b255-080027cf389a",
    clientId : "b3U6g0_exC4REeayVQgAJ884mg",
    clientSecret : "b3U6JaRs50O37MrH4ZaoqEMHDwzwkaY"
};
exports.mail = {
    transport : "smtps://thebrikoleur%40gmail.com:B0p2w1q2w@smtp.gmail.com",
    from : "\"The Brikoleur\" <thebrikoleur@gmail.com>"
};
exports.users = {
    resetpw : {
        url : "http://127.0.0.1:8081/resetpw",
        returnUrl : "http://127.0.0.1:8081/login.html",
        expires : 3600
    }
};