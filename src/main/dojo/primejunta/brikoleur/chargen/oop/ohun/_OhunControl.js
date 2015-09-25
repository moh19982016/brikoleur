define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/string",
        "dojo/topic",
        "dojo/dom-class",
        "dijit/form/Select",
        "./../../_base/util",
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
        data : {},
        selectedFeaturesTopic : "/SelectedOhun/",
        featureAddedTopic : "/OhunAdded/",
        maxLevel : 0,
        propertyPresentWarning : i18n.PowerPresent,
        templateString : template,
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/StatChanged/-os", lang.hitch( this, this.createSelector )));
            this.own( topic.subscribe( this.featureAddedTopic, lang.hitch( this, this._updateState )));
        },
        createSelector : function()
        {
            var min = this.data.min_level !== undefined ? this.data.min_level : 1;
            this._updateState();
            if( this.data.type == "ad-hoc" )
            {
                this.displayNode.style.display = "block";
                this.controlNode.style.display = "none";
                return;
            }
            this.inherited( arguments );
            if( this._levelSelector )
            {
                this._level = this._levelSelector.get( "value" );
                this._levelSelector.destroy();
            }
            var opts = [];
            for( var i = min; i <= Controller.get( "os" ) + 2; i++ )
            {
                opts.push({ value : "" + i, label : "" + i });
            }
            this._levelSelector = new Select({ options : opts, style : "width:100%" }).placeAt( this.levelSelectorNode );
            this._levelSelector.own( on( this._levelSelector, "change", lang.hitch( this, this._onLevelChange ) ) );
            if( this._level )
            {
                this._levelSelector.set( "value", this._level );
            }
            this.onJujuChange( Controller.get( "juju" ) );
        },
        mayAdd : function( value )
        {
            return !!( this._selector.get( "value") );
        },
        onJujuChange : function( juju )
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
        pleaseDestroy : function()
        {
            this.parent.pleaseRemove( this );
            this.destroy();
        },
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
        _updateState : function()
        {
            var count = util.countItems( this.parent.parent.controls );
            var os = Controller.get( "os" );
            if( !this._levelSelector )
            {
                var cap = os - count;
                var min = this.data.min_level !== undefined ? this.data.min_level : 1;
                var max = os + 2;
                if( this.data.type == "ad-hoc" )
                {
                    this.valueNode.innerHTML = string.substitute( i18n.AdHocOhunDescription, { name : this.data.name.toLowerCase(), verb : this.data.verb || "create", cap : cap, min : min, max : max });
                    this.deleteButton.domNode.style.display = "none";
                }
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
        _onLevelChange : function( val )
        {
            this.level = val;
            this._checkAddButton();
        },
        _checkAddButton : function()
        {
            this.addButton.set( "disabled", parseInt( this._levelSelector.get( "value" ) ) > Controller.get( "juju" ) );
        },
        _setValue : function( val )
        {
            this.valueNode.innerHTML = "(" + i18n.Level + this.level + ") " +  val;
            if( this._selector )
            {
                this._selector.set( "value", val );
            }
        },
        _setState : function( state )
        {
            this.key = state.key;
            this.level = state.level;
            this.inherited( arguments );
        }
    });
});