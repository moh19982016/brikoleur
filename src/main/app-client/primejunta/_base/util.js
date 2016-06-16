define([], function()
{
    return {
        getRequestMessage : function( actionStr, dataType, requestMap, logList )
        {
            return {
                action_str : actionStr || "retrieve",
                data_type : dataType,
                request_map : requestMap || {},
                log_list : logList || []
            }
        },
        hasStatus : function( message, prop, val )
        {
            var logList = message.log_list || [];
            for( var i = 0; i < logList.length; i++ )
            {
                if( logList[ i ][ prop ] == val )
                {
                    return true;
                }
            }
            return false;
        }
    }
});