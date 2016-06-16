define([ "dojo/_base/lang",
         "dojo/Deferred",
         "dojo/request" ],
function( lang,
          Deferred,
          request )
{
    return {
        post : function( url, message, headers )
        {
            return this._send( url, message, "post", headers );
        },
        get : function( url, message, headers )
        {
            return this._send( url, message, "get", headers );
        },
        put : function( url, message, headers )
        {
            return this._send( url, message, "put", headers );
        },
        del : function( url, message, headers )
        {
            return this._send( url, message, "del", headers );
        },
        _send : function( url, message, method, headers )
        {
            var cType = "application/x-www-form-urlencoded";
            if( method == "get" )
            {
                if( typeof message == "string" )
                {
                    message = JSON.parse( message );
                }
            }
            else
            {
                cType = "application/json";
                if( typeof message != "string" )
                {
                    message = JSON.stringify( message );
                }
            }
            headers = lang.mixin( headers || {}, { "Content-Type" : cType } );
            return request[ method ]( url, {
                handleAs : "json", headers : headers, data : message
            } );
        }
    }
});