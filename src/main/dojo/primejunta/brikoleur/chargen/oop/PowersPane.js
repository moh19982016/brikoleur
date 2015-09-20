define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/topic",
        "./../data/traits",
        "./../_base/util",
        "./../_base/_FeaturePaneBase",
        "./_base/_ControlPaneMixin",
        "./_base/FilteringMemory",
        "./_PowersControl",
        "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          lang,
          array,
          topic,
          traits,
          util,
          _FeaturePaneBase,
          _ControlPaneMixin,
          FilteringMemory,
          _PowersControl,
          i18n )
{
    return declare([ _FeaturePaneBase, _ControlPaneMixin ],
    {
        title : i18n.Powers,
        icon : "bolt",
        allowedControls : -1,
        featureControl : _PowersControl,
        selectedFeaturesTopic : "/SelectedPowers/",
        postCreate : function()
        {
            this.controls = [];
            this._store = new FilteringMemory({ data : util.listToStoreData( traits.list ) });
            topic.subscribe( "/SelectedTraits/", lang.hitch( this, this.setupPowers ) );
        },
        setupPowers : function( traits ) // TODO: abstract out to cover Ohun
        {
            var values = util.getValues( this.controls );
            for( var i = 0; i < traits.length; i++ )
            {
                if( traits[ i ] && array.indexOf( values, traits[ i ] ) == -1 )
                {
                    var powers = this._store.get( traits[ i ] ).powers;
                    if( powers )
                    {
                        for( var j = 0; j < powers.length; j++ )
                        {
                            this.featureAdded({
                                value : traits[ i ],
                                data : powers[ j ]
                            });
                        }
                    }
                }
            }
        }
    });
});