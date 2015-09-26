define([ "dojo/_base/declare",
         "./../../_base/_FeaturePaneBase",
        "./../../_base/_FieldBase",
        "./../../_base/_TextareaField",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          _FeaturePaneBase,
          _FieldBase,
          _TextAreaField,
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
            this.addField( "background", _TextAreaField, { title : i18n.Background, layout : "down" } );
        }
    });
});