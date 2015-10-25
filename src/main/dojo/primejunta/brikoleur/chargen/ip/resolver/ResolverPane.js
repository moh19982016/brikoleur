/**
 * Task resolver pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dojo/dom-construct",
         "./_TrainingControl",
         "./../../_base/_FeaturePaneBase",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          domConstruct,
          _TrainingControl,
          _FeaturePaneBase,
          i18n )
{
    return declare( [ _FeaturePaneBase ],
    {
        title : i18n.ResolveTask,
        icon : "☭",
        iconType : "literal",
        buildRendering : function()
        {
            this.inherited( arguments );
            this.trainingNode = domConstruct.create( "div", { "class" : "br-floatLeft br-trainingNode" }, this.domNode );
            this.resourcesNode = domConstruct.create( "div", { "class" : "br-floatLeft br-bonusNode" }, this.domNode );
            this.intelNode = domConstruct.create( "div", { "class" : "br-floatLeft br-bonusNode" }, this.domNode );
            this.ohunNode = domConstruct.create( "div", { "class" : "br-floatLeft br-bonusNode" }, this.domNode );
            this.resolveNode = domConstruct.create( "div", { "class" : "br-floatLeft br-bonusNode" }, this.domNode );
            domConstruct.create( "div", { "style" : "clear:both" }, this.domNode );
        },
        _setState : function( state )
        {
            for( var i = 0; i < state.length; i++ )
            {
                var ctrl = new _TrainingControl({ parent : this }).placeAt( this.trainingNode );
                ctrl.set( "state", state[ i ] );
                this.controls.push( ctrl );
            }
        }
    } );
});