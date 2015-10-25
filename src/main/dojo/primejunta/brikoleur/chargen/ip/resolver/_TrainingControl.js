define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "./../../_base/_FeatureControlBase" ],
function( declare,
          lang,
          _FeatureControlBase )
{
    var Constr = declare([ _FeatureControlBase ], {
        postCreate : function()
        {
            this.inherited( arguments );
            this.childConstructor = Constr;
        },
        _setState : function( state )
        {
            this.inherited( arguments );
        },
        _setChildState : function( state )
        {
            if( state.value )
            {
                this.createChildControl({}).set( "state", state );
            }
        }
    });
    return Constr;
});