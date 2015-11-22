/**
 * Control for adding and managing an Ohun.
 *
 * @private Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/on",
         "dojo/string",
         "dojo/topic",
         "dojo/dom-class",
         "dijit/form/Select",
         "./../_base/util",
         "./../_base/_FeatureControlBase",
         "dojo/text!./templates/_OhunControl.html",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          on,
          string,
          topic,
          domClass,
          Select,
          util,
          _FeatureControlBase,
          template,
          i18n )
{
    return declare([ _FeatureControlBase ], {
        /**
         * Data for the feature.
         *
         * @public Object
         */
        data : {},
        /**
         * Topic published when feature selection changes. In this case, we send them to dev/null.
         *
         * @final
         * @public string
         */
        selectedFeaturesTopic : "/null/",
        /**
         * Topic published when a feature of this type is added. Used to update state f.ex. if there are limits to the
         * number of controls we can add.
         *
         * @final
         * @public string
         */
        featureAddedTopic : "/OhunAdded/",
        /**
         * Maximum depth allowed for descendants for controls of this type.
         *
         * @public int
         */
        maxLevel : 0,
        /**
         * Warning to display if trying add another item with the same name and type.
         *
         * @final
         * @public string
         */
        propertyPresentWarning : i18n.PowerPresent,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then subscribe to topics fired when ohun slots change or sibling Ohun are added, with
         * .createSelector and _updateState respectively. Then fire ._updateState to set up initial state.
         *
         * @public void
         */
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/StatChanged/-os", lang.hitch( this, this.createSelector )));
            this.own( topic.subscribe( this.featureAddedTopic, lang.hitch( this, this._updateState )));
            this._updateState();
        },
        /**
         * Set up UI depending on ohun type: ad-hoc ohun only get a description, if a ._levelSelector is needed, create
         * it, and fire .onJujuChange once to set up initial state.
         *
         * @public void
         */
        createSelector : function()
        {
            var min = this.data.min_level !== undefined ? this.data.min_level : 1;
            this._updateState();
            if( this.data.type == "ad-hoc" )
            {
                this.complete = true;
                this.setDescription( this.data || {} );
                return;
            }
            this.inherited( arguments );
            if( this._levelSelector )
            {
                this._level = this._levelSelector.get( "value" );
                this._levelSelector.destroy();
            }
            var opts = [];
            for( var i = min; i <= Controller.get( "os" ); i++ )
            {
                opts.push({ value : "" + i, label : "" + i });
            }
            this._levelSelector = new Select({ options : opts, style : "width:100%" }).placeAt( this.levelSelectorNode );
            this._levelSelector.own( on( this._levelSelector, "change", lang.hitch( this, this._onLevelChange ) ) );
            this.own( this._levelSelector );
            if( this._level )
            {
                this._levelSelector.set( "value", this._level );
            }
            this.onJujuChange( Controller.get( "juju" ) );
        },
        /**
         * If selector has a value we may add it. No enforced uniques for ohun.
         *
         * @public boolean
         */
        mayAdd : function()
        {
            return !!( this._selector.get( "value") );
        },
        /**
         * If we have a level selector, disable any options that cost more than the available juju, and
         * ._checkAddButton.
         *
         * @param juju
         * @public void
         */
        onJujuChange : function( /* int */ juju )
        {
            if( !this._levelSelector )
            {
                return;
            }
            var opts = this._levelSelector.get( "options" );
            for( var i = 0; i < opts.length; i++ )
            {
                opts[ i ].disabled = parseInt( opts[ i ].value ) > juju;
            }
            this._levelSelector.set( "options", opts );
            this._checkAddButton();
        },
        /**
         * For ohun, cost = level.
         *
         * @public int
         */
        getCost : function()
        {
            return this.level;
        },
        /**
         * As parent to remove self from controls, and .destroy().
         *
         * @public void
         */
        pleaseDestroy : function()
        {
            this.parent.pleaseRemoveControl( this );
            this.destroy();
        },
        /**
         * Reads state from UI controls into Object { name, level, value } and returns it, unless there's no level
         * selector, in which case, inherited.
         *
         * @private Object
         */
        _readState : function()
        {
            if( this._levelSelector )
            {
                return {
                    name : this.data.name,
                    level : this._levelSelector.get( "value" ),
                    value : this._selector.get( "value" )
                }
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        /**
         * Count total ohun by looking up two levels, and update display and state to match free ohun slots.
         *
         * @private void
         */
        _updateState : function()
        {
            var count = util.countItems( this.parent.parent.controls );
            var os = Controller.get( "os" );
            if( this.data.type == "ad-hoc" )
            {
                var cap = os - count;
                var min = this.data.min_level !== undefined ? this.data.min_level : 1;
                var max = os + 2;
                this.displayNode.style.display = "block";
                this.controlNode.style.display = "none";
                this.valueNode.innerHTML = string.substitute( i18n.AdHocOhunDescription, { name : this.data.name.toLowerCase(), verb : this.data.verb || "create", cap : cap, min : min, max : max });
                this.deleteButton.domNode.style.display = "none";
                this.complete = true;
                this.setDescription( this.data || {} );
            }
            else if( count >= os )
            {
                domClass.add( this.domNode, "br-controlsDisabled" );
            }
            else
            {
                domClass.remove( this.domNode, "br-controlsDisabled" );
            }
        },
        /**
         * Set level to val and ._checkAddButton. We do this because ohun slots may change independently of the UI
         * controls here.
         *
         * @param val
         * @private void
         */
        _onLevelChange : function( /* int */ val )
        {
            this.level = val;
            this._checkAddButton();
        },
        /**
         * Enable add if there's enough juju to buy the ohun.
         *
         * @private void
         */
        _checkAddButton : function()
        {
            this.addButton.set( "disabled", parseInt( this._levelSelector.get( "value" ) ) > Controller.get( "juju" ) );
        },
        /**
         * Display level and val in .valueNode, and set selector's value to val if applicable.
         *
         * @param val
         * @private void
         */
        _setValue : function( /* string */ val )
        {
            this.valueNode.innerHTML =  this.level + "/" +  val;
            if( this._selector )
            {
                this._selector.set( "value", val );
            }
        },
        /**
         * Sets .key and .level from state, then inherited.
         *
         * @param state
         * @private void
         */
        _setState : function( /* Object */ state )
        {
            this.key = state.key;
            this.level = state.level;
            this.inherited( arguments );
        }
    });
});