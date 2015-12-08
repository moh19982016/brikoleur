/**
 * Description pane. Just contains fields for handle, ekip, and background.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/dom-construct",
         "dijit/form/Textarea",
         "./_PortraitControl",
         "./../../_base/_FeaturePaneBase",
         "./../../_base/_FieldBase",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          domConstruct,
          Textarea,
          _PortraitControl,
          _FeaturePaneBase,
          _FieldBase,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.Description,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "user",
        /**
         * Add fields for handle, ekip, background.
         *
         * @public void
         */
        postCreate : function()
        {
            var pNode = domConstruct.create( "div", { "style" : "float:right;width:200px;" }, this.domNode );
            var fNode = domConstruct.create( "div", { "style" : "float:right;width:calc( 100% - 200px );" }, this.domNode );
            var bNode = domConstruct.create( "div", { "style" : "clear:both" }, this.domNode );
            this.addField( "portrait", _PortraitControl, { title : "" }, pNode );
            this.addField( "player", _FieldBase, { title : i18n.Player, inputClass : "br-fullWidth", layout : "down" }, fNode );
            this.addField( "handle", _FieldBase, { title : i18n.Handle, inputClass : "br-fullWidth", layout : "down" }, fNode );
            this.addField( "ekip", _FieldBase, { title : i18n.Ekip, inputClass : "br-fullWidth", layout : "down" }, fNode );
            this.addField( "background", _FieldBase, { title : i18n.Background, layout : "down", inputWidget : Textarea }, bNode );
        }
    });
});