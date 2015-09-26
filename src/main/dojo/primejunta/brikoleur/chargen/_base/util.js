define([ "dojo/_base/lang",
        "dojo/on",
        "dojo/dom-construct",
        "dojo/Deferred",
        "dijit/Tooltip",
        "dijit/Dialog",
        "dijit/form/Button",
        "dojo/i18n!./../../nls/CharGen" ],
function( lang,
          on,
          domConstruct,
          Deferred,
          Tooltip,
          Dialog,
          Button,
          i18n )
{
    return {
        listToStoreData : function( list )
        {
            for( var i = 0; i < list.length; i++ )
            {
                var cur = list[ i ];
                if( typeof cur == "string" )
                {
                    list[ i ] = { id : cur, name : cur };
                }
                else if( cur.name )
                {
                    cur.id = cur.name;
                }
            }
            return list;
        },
        showWarning : function( warning, aroundNode, aroundDir )
        {
            Tooltip.show( warning, aroundNode, aroundDir || [ "before", "above", "below", "after" ] );
            setTimeout( lang.hitch( this, function()
            {
                on.once( document.body, "click", lang.hitch( this, function()
                {
                    Tooltip.hide( aroundNode );
                }));
            }), 1 );
        },
        get : function( prop, selector, store )
        {
            if( prop == "value" )
            {
                return this.get( "item", selector, store ).id;
            }
            else if( prop == "item" )
            {
                var val = selector.get( "value" );
                return store.get( val ) || { id : val, name : val };
            }
            else
            {
                return false;
            }
        },
        getProperties : function( prop, controls, self, recurse )
        {
            var out = [];
            for( var i = 0; i < controls.length; i++ )
            {
                if( controls[ i ] !== self )
                {
                    out.push( controls[ i ].get( prop ) );
                    if( recurse && controls[ i ].controls )
                    {
                        out = out.concat( this.getProperties( prop, controls[ i ].controls, self, recurse ) );
                    }
                }
            }
            return out;
        },
        countItems : function( controls )
        {
            var n = 0;
            for( var i = 0; i < controls.length; i++ )
            {
                n += controls[ i ].countItems();
            }
            return n;
        },
        showTooltip : function( label, node )
        {
            Tooltip.show( label, node );
            setTimeout( lang.hitch( this, function()
            {
                on.once( document.body, "click", lang.hitch( Tooltip, Tooltip.hide, node ) );
            }), 1 );
        },
        alert : function( message, title )
        {
            title = title || i18n.DialogTitle;
            return this._showDialog( message, [{ value : true, label : i18n.Continue }], title );
        },
        confirm : function( message, options, title )
        {
            title = title || i18n.DialogTitle;
            options = options || [{ value : true, label : i18n.Accept, className : "br-blueButton" }, { value : false, label : i18n.Cancel, className : "br-redButton" }];
            return this._showDialog( message, options, title );
        },
        _showDialog : function( message, options, title )
        {
            if( !this._dialog )
            {
                this._dialog = new Dialog().placeAt( document.body );
            }
            this._dialog.set( "title", title );
            var content = domConstruct.create( "div", { innerHTML : message } );
            var btnNode = domConstruct.create( "div", { "class" : "br-dialogButtons" }, content );
            this._buttons = this._createButtons( options, btnNode );
            this._dialog.set( "content", content );
            this._dialog.show();
            this._dialogPromise = new Deferred();
            return this._dialogPromise;
        },
        _createButtons : function( options, content )
        {
            var out = [];
            for( var i = 0; i < options.length; i++ )
            {
                out.push( new Button({ label : options[ i ].label, onClick : lang.hitch( this, this._resolveDialog, options[ i ].value ), className : options[ i ].className } ).placeAt( content ) );
            }
        },
        _resolveDialog : function( reslt )
        {
            this._dialog.hide();
            setTimeout( lang.hitch( this, function()
            {
                this._dialog.destroyDescendants();
            }), 500 );
            if( reslt )
            {
                this._dialogPromise.resolve( reslt );
            }
            else
            {
                this._dialogPromise.reject( reslt );
            }
        }
    }
});
