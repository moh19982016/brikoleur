define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "./_ControlPaneMixin",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojo/text!./templates/_FeatureSubPane.html" ],
function( declare,
          lang,
          _ControlPaneMixin,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare([ _WidgetBase, _TemplatedMixin, _ControlPaneMixin ], {
        data : {},
        templateString : template,
        allowedControls : -1,
        value : "",
        featureAdded : function( kwObj )
        {
            kwObj = kwObj || {};
            kwObj.data = this.data;
            this.inherited( arguments, [ kwObj ] );
        }
    });
});