/**
 * Control for oga, which behaves like a knack except that training costs nothing and you can't specialise.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dijit/form/TextBox",
         "./../_base/_FeatureControlBase",
         "dojo/text!./templates/_OgaControl.html" ],
function( declare,
          TextBox,
          _FeatureControlBase,
          template )
{
    return declare([ _FeatureControlBase ], {
        /**
         * Oga are always complete.
         *
         * @final
         * @public boolean
         */
        complete : true,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Oga don't take child controls.
         *
         * @public void
         */
        addChildControl : function() {},
        /**
         * Augments inherited with .oga = true and state of socketed oga.
         *
         * @private Object
         */
        _getState : function()
        {
            var state = this.inherited( arguments );
            state.oga = true;
            state.controls.push({
                name : this.socketedTrainingInput.get( "value" ),
                value : this.socketedTrainingInput.get( "value" )
            });
            return state;
        },
        /**
         * Sets .state to state, and value of socketedTrainingInput from it, if provided.
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object */ state )
        {
            this.state = state;
            if( this.state.controls && this.state.controls[ 0 ] && this.state.controls[ 0 ].value )
            {
                this.socketedTrainingInput.set( "value", this.state.controls[ 0 ].value );
            }
        }
    });
});