define( [ "./util" ],
function( util )
{
    return {
        CODE_KEY_MAP : {
            "200" : "ok",
            "400" : "bad_request",
            "401" : "authorization_required",
            "403" : "not_authorized",
            "404" : "not_found",
            "500" : "internal_error"
        },
        debug : function( req, userMsg, codeKey, codeStr )
        {
            this.log( req, userMsg, codeKey, codeStr, 0 );
        },
        info : function( req, userMsg, codeKey, codeStr )
        {
            this.log( req, userMsg, codeKey, codeStr, 1 );
        },
        warn : function( req, userMsg, codeKey, codeStr )
        {
            this.log( req, userMsg, codeKey, codeStr, 2 );
        },
        error : function( req, userMsg, codeKey, codeStr )
        {
            this.log( req, userMsg, codeKey, codeStr, 3 );
        },
        fatal : function( req, userMsg, codeKey, codeStr )
        {
            this.log( req, userMsg, codeKey, codeStr, 4 );
        },
        off : function( req, userMsg, codeKey, codeStr )
        {
            this.log( req, userMsg, codeKey, codeStr, 5 );
        },
        log : function( req, userMsg, codeKey, codeStr, logLevel )
        {
            codeKey = codeKey || "200";
            codeStr = codeStr || this.CODE_KEY_MAP[ codeKey ] || "undefined";
            req.log_list = req.log_list || [];
            req.log_list.push( util.getLogItem( {
                code_key : codeKey,
                code_str : codeStr,
                user_msg : userMsg,
                level_int : logLevel
            } ) );
        },
        writeLog : function( logList )
        {
            logList = logList || [];
            for( var i = 0; i < logList.length; i++ )
            {
                console.log( logList[ i ] );
            }
        }
    }
} );