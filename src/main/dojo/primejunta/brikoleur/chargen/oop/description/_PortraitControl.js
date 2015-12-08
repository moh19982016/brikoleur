define( [ "dojo/_base/declare",
          "./_ImageControl",
          "./../../_base/_FieldBase",
          "dojo/text!./templates/_PortraitControl.html" ],
function( declare,
          _ImageControl,
          _FieldBase,
          template )
{
    return declare( [ _FieldBase ], {
        layout: "down",
        templateString : template,
        inputWidget : _ImageControl
    } );
} );