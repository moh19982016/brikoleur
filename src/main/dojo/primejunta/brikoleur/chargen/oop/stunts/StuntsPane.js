define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "dojo/string",
        "dojo/dom-class",
        "./_StuntControl",
        "./../_base/_ControlContainerMixin",
        "./../../_base/util",
        "./../../_base/_FeaturePaneBase",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          string,
          domClass,
          _StuntControl,
          _ControlContainerMixin,
          util,
          _FeaturePaneBase,
          i18n )
{
    return declare([ _FeaturePaneBase, _ControlContainerMixin ],
    {
        title : i18n.Stunts,
        featureName : i18n.Stunts,
        icon : "crosshairs",
        allowedControls : 0,
        controls : [],
        postCreate : function()
        {
            this.own( topic.subscribe( "/TrainingAdded/", lang.hitch( this, this.checkStunt ) ) );
            this.descendantFeatureAdded();
        },
        checkStunt : function( control )
        {
            if( control.type == "combat" )
            {
                this.allowedControls++;
                this.enableAddStunt();
            }
        },
        enableAddStunt : function()
        {
            this.featureAdded();
        },
        featureAdded : function()
        {
            if( !Controller.loading )
            {
                this.publishStatus();
            }
            this.checkCreateControl();
            this.descendantFeatureAdded();
            if( this.minimized )
            {
                this.maximize();
            }
        },
        validate : function()
        {
            if( util.getProperties( this.controls, { property : "complete", recurse : true, filter : true }).length < this.allowedControls )
            {
                return {
                    valid : false,
                    message : string.substitute( i18n.PleaseSelectRequiredFeatures, { num : this.allowedControls, name : this.featureName } )
                }
            }
            else
            {
                return {
                    valid : true
                }
            }
        },
        publishStatus : function( synthetic )
        {
            topic.publish( "/SelectedStunts/", util.getProperties( this.controls, { property : "value" }), synthetic );
        },
        descendantFeatureAdded : function()
        {
            this.updateAllowedControls();
            if( util.countItems( this.controls ) >= this.allowedControls )
            {
                domClass.add( this.domNode, "br-maxPowers" );
            }
            else
            {
                domClass.remove( this.domNode, "br-maxPowers" );
                this.checkCreateControl();
            }
        },
        updateAllowedControls : function()
        {
            this.allowedControls = Controller.getAllowedStunts();
        },
        checkCreateControl : function()
        {
            if( !this._hasOpenStunt() )
            {
                this.controls.push( new _StuntControl({ parent : this, filter : this.listFeatures() } ).placeAt( this.containerNode ) );
            }
        },
        _hasOpenStunt : function()
        {
            for( var i = 0; i < this.controls.length; i++ )
            {
                if( !this.controls[ i ].complete )
                {
                    return true;
                }
            }
            return false;
        },
        _setState : function( state )
        {
            this.clear();
            for( var i = 0; i < state.length; i++ )
            {
                var ctl = new _StuntControl({ parent : this } ).placeAt( this.containerNode );
                ctl.set( "state", state[ i ] );
                this.controls.push( ctl );
            }
            if( this.controls.length > 0 )
            {
                this.maximize();
            }
        }
    });
});