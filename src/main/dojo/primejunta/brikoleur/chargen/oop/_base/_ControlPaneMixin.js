/**
 * Mixin which provides features for supporting child controls in a pane.
 *
 * @public Mixin
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dojo/string",
         "./../../_base/util",
         "./../../_base/_ControlContainerMixin",
         "dojo/i18n!./../../../nls/CharGen" ],
function( declare,
          lang,
          topic,
          string,
          util,
          _ControlContainerMixin,
          i18n )
{
    return declare([ _ControlContainerMixin ], {
        /**
         * Number of controls allowed.
         *
         * @public int
         */
        allowedControls : 0,
        /**
         * Feature name. Used in validation failure message.
         *
         * @public string
         */
        featureName : "",
        /**
         * Initialize .controls, and .addFeature().
         *
         * @public void
         */
        postCreate : function()
        {
            this.controls = [];
            this.addFeature();
        },
        /**
         * If we're allowed another control, .addControl. Then .publishInfo and .maximize if we're minimized.
         *
         * @param kwObj
         * @public void
         */
        addFeature : function( /* Object */ kwObj )
        {
            if( this.allowedControls < 0 || this.controls.length < this.allowedControls )
            {
                this.addControl( kwObj );
            }
            if( !Controller.loading )
            {
                this.publishInfo();
            }
            if( this.minimized && this.maximize )
            {
                this.maximize();
            }
        },
        /**
         * Create a new .childConstructor in .containerNode at pos or "last", with properties from kwObj, with this as
         * parent and filter as _ControlContainerMixin::listFeatures().
         *
         * @param kwObj
         * @param pos - "before"|"after"|"first"|"last"
         * @public Widget
         */
        addControl : function( /* Object */ kwObj, /* string? */ pos )
        {
            var ctl = new this.childConstructor( lang.mixin( kwObj || {}, { parent : this, filter : this.listFeatures() } )).placeAt( this.containerNode, pos || "last" );
            this.controls.push( ctl );
            return ctl;
        },
        /**
         * Count controls recursively with util.countItems and return it.
         *
         * @public int
         */
        countItems : function()
        {
            return util.countItems( this.controls );
        },
        /**
         * Check that all .allowedControls are present and .complete; return valid:false with a polite message if not, else
         * return valid:true.
         *
         * @public Object - { valid : {boolean}, message? : {error message} }
         */
        validate : function()
        {
            if( this.allowedControls > 0 && util.getProperties( this.controls, { property : "complete", filter : true }).length < this.allowedControls )
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
        /**
         * When the child has been augmented, .addFeature for another one.
         *
         * @public void
         */
        onAugmentChild : function()
        {
            this.addFeature();
        },
        /**
         * Fired when a descendant is added.
         *
         * @stub
         * @public void
         */
        onAddDescendant : function()
        {
        },
        /**
         * Publish .selectedFeaturesTopic with list of values retrieved from .controls with util.getProperties.
         *
         * @param synthetic - used to distinguish .setState from user-initiated events.
         */
        publishInfo : function( synthetic )
        {
            topic.publish( this.selectedFeaturesTopic, util.getProperties( this.controls, { property : "value" }), synthetic );
        },
        /**
         * Pops to destroy all .controls.
         *
         * @public void
         */
        clear : function()
        {
            while( this.controls.length > 0 )
            {
                this.controls.pop().destroy();
            }
        },
        /**
         * Clear, then inherited.
         *
         * @public void
         */
        destroy : function()
        {
            this.clear();
            this.inherited( arguments );
        },
        /**
         * Clear, then for each item in state, .addControl and set its state to match the item.
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object[] */ state )
        {
            this.clear();
            for( var i = 0; i < state.length; i++ )
            {
                this.addControl({}, false, state[ i ] ).set( "state", state[ i ] );
            }
        }
    });
});