define( [ "dojo/_base/lang",
          "dojo/dom-class" ],
function( lang,
          domClass )
{
    return {
        fxClassName : "br-fxInProgress",
        flash : function( node, className, duration )
        {
            duration = duration || 300;
            domClass.add( node, this.fxClassName + " " + className );
            setTimeout( lang.hitch( this, function()
            {
                domClass.remove( node, className );
            } ), duration );
            setTimeout( lang.hitch( this, function()
            {
                domClass.remove( node, this.fxClassName );
            } ), duration * 2 );
        }
    }
} );