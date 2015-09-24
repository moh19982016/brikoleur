define([ "dojo/_base/declare",
        "./_FieldBase",
        "dijit/form/Textarea" ],
function( declare,
          _FieldBase,
          Textarea )
{
    return declare([ _FieldBase ], {
        inputWidget : Textarea
    });
});