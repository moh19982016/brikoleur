/**
 * Pane managing stunts.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dojo/string",
         "dojo/dom-class",
         "./_StuntControl",
         "./../../_base/_ControlContainerMixin",
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
        /**
         * Title.
         *
         * @final
         * @public string
         */
        title : i18n.Stunts,
        /**
         * Feature name. Used in validation failure message.
         *
         * @final
         * @public string
         */
        featureName : i18n.Stunts,
        /**
         * Icon.
         *
         * @final
         * @public string
         */
        icon : "crosshairs",
        /**
         * Number of controls allowed (-1 is unlimited).
         *
         * @public int
         */
        allowedControls : 0,
        /**
         * Array for sub-controls.
         *
         * @public Widget[]
         */
        controls : [],
        /**
         * Constructor for child controls.
         *
         * @final
         * @public Function
         */
        childConstructor : _StuntControl,
        /**
         * Subscribe to /TrainingAdded/ topic with .checkStunt, and .onAddDescendant to setup initial state.
         *
         * @public void
         */
        postCreate : function()
        {
            this.own( topic.subscribe( "/TrainingAdded/", lang.hitch( this, this.checkStunt ) ) );
            this.own( topic.subscribe( "/TrainingRemoved/", lang.hitch( this, this.removeStunt ) ) );
            this.onAddDescendant();
        },
        /**
         * If control represents combat training, bump .allowedControls and .enableAddStunt().
         *
         * @param control
         * @public void
         */
        checkStunt : function( /* _KnackControl */ control )
        {
            if( control.type == "combat" )
            {
                this.allowedControls++;
                this.enableAddStunt();
            }
        },
        removeStunt : function( control )
        {
            if( control.type == "combat" )
            {
                this.onAddDescendant();
            }
        },
        /**
         * To enable adding a stunt, .addFeature().
         *
         * @public void
         */
        enableAddStunt : function()
        {
            this.addFeature();
        },
        /**
         * First, .publishInfo if we're not loading. Then .checkCreateControl, .onAddDescendant, and maximize if
         * minimized.
         *
         * @public void
         */
        addFeature : function()
        {
            if( !Controller.loading )
            {
                this.publishInfo();
            }
            this.checkCreateControl();
            this.onAddDescendant();
            if( this.minimized )
            {
                this.maximize();
            }
        },
        /**
         * If we have any open stunts, fail. Else succeed.
         *
         * @public Object - valid : {boolean}, message : {string}
         */
        validate : function()
        {
            var nStunts = util.getProperties( this.controls, { property : "complete", recurse : true, filter : true }).length;
            if( nStunts > this.allowedControls )
            {
                return {
                    valid : false,
                    message : i18n.TooManyStunts
                }
            }
            else if( nStunts < this.allowedControls )
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
         * Publish /SelectedStunts/ from .controls.
         *
         * @param synthetic
         * @public void
         */
        publishInfo : function( /* boolean */ synthetic )
        {
            topic.publish( "/SelectedStunts/", util.getProperties( this.controls, { property : "value" }), synthetic );
        },
        /**
         * Call .updateAllowedControls, and add/remove CSS class indicating if the cap for stunts has been hit or not,
         * then .checkCreateControl if we're below the cap.
         *
         * @public void
         */
        onAddDescendant : function()
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
        /**
         * Update .allowedControls with Controller.characterPane.getAllowedStunts(). Only Controller can know since it has access to
         * the Knacks pane which has the required info.
         *
         * @public void
         */
        updateAllowedControls : function()
        {
            this.allowedControls = Controller.characterPane.getAllowedStunts();
        },
        /**
         * If we don't have an open stunt, create a new _StuntControl at .containerNode, making this the parent.
         *
         * @public void
         */
        checkCreateControl : function()
        {
            if( !this._hasOpenStunt() )
            {
                this.controls.push( new this.childConstructor({ parent : this, filter : this.listFeatures() } ).placeAt( this.containerNode ) );
            }
        },
        /**
         * Destroy all .controls, then inherited.
         *
         * @public void
         */
        destroy : function()
        {
            while( this.controls.length > 0 )
            {
                this.controls.pop().destroy();
            }
            this.inherited( arguments );
        },
        /**
         * If there's an incomplete (=open) _StuntControl in controls, return true; else return false.
         *
         * @private boolean
         */
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
        /**
         * Clear, then iterate through state, creating a _StuntControl for each, pushing them into .controls. Then
         * maximize if any controls were added.
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object[] */ state )
        {
            this.clear();
            for( var i = 0; i < state.length; i++ )
            {
                var ctl = new this.childConstructor({ parent : this } ).placeAt( this.containerNode );
                ctl.set( "state", state[ i ] );
                this.controls.push( ctl );
            }
            this._checkMaximize();
            this.onAddDescendant();
        },
        /**
         * If we have controls, maximize.
         *
         * @private void
         */
        _checkMaximize : function()
        {
            if( this.controls.length > 0 )
            {
                this.maximize();
            }
        }
    });
});