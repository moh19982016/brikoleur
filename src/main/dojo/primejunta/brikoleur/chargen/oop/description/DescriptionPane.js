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
        title : i18n.Description,
        icon : "user",
        postCreate : function()
        {
            this.addField( "handle", _FieldBase, { title : i18n.Handle, inputClass : "br-fullWidth", layout : "down" } );
            this.addField( "ekip", _FieldBase, { title : i18n.Ekip, inputClass : "br-fullWidth", layout : "down" } );
            this.addField( "background", _FieldBase, { title : i18n.Background, layout : "down", inputWidget : Textarea } );
        }
    });
});