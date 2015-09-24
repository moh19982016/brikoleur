define([ "dojo/_base/declare",
         "./../../_base/_FeaturePaneBase",
        "./../../_base/_FieldBase",
        "./../../_base/_TextareaField",
        "./_GenderField",
         "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          _FeaturePaneBase,
          _FieldBase,
          _TextAreaField,
          _GenderField,
          i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        title : i18n.Description,
        icon : "user",
        postCreate : function()
        {
            this.addField( "gender", _GenderField, { title : i18n.Gender, value : "0" } );
            this.addField( "handle", _FieldBase, { title : i18n.Handle } );
            this.addField( "ekip", _FieldBase, { title : i18n.Ekip } );
            this.addField( "background", _TextAreaField, { title : i18n.Background } );
        }
    });
});