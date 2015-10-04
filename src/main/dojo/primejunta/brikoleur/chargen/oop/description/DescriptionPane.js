/**
 * Description pane. Just contains fields for handle, ekip, and background.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dijit/form/Textarea",
         "./../../_base/_FeaturePaneBase",
         "./../../_base/_FieldBase",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          Textarea,
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
            this.addField( "handle", _FieldBase, { title : i18n.Handle, inputClass : "br-fullWidth", layout : "down" } );
            this.addField( "ekip", _FieldBase, { title : i18n.Ekip, inputClass : "br-fullWidth", layout : "down" } );
            this.addField( "background", _FieldBase, { title : i18n.Background, layout : "down", inputWidget : Textarea } );
        }
    });
});