define([ "dojo/_base/lang",
         "dojo/on",
         "dojo/dom-construct",
         "dojo/Deferred",
         "dijit/Tooltip",
         "dijit/Dialog",
         "dijit/form/Button",
         "dojo/i18n!./../../../nls/CharGen" ],
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
        /**
         * Examines a set of controls and returns the value of an attribute as an array.
         *
         * @param controls  - control array being traversed
         * @param kwObj - property - property to look up
         *              - self - control which may be in array, if provided, will be skipped
         *              - recurse - if true, will recurse into children
         *              - level - if true, will ignore anything of lower level
         *              - filter - if true, will remove falsies from the array
         * @returns {Array}
         */
        getProperties : function( controls, kwObj )
        {
            var out = [];
            for( var i = 0; i < controls.length; i++ )
            {
                if( controls[ i ] !== kwObj.self )
                {
                    if( !kwObj.level || controls[ i ].level >= kwObj.level )
                    {
                        out.push( controls[ i ].get( kwObj.property ) );
                    }
                    if( kwObj.recurse && controls[ i ].controls )
                    {
                        
                        out = out.concat( this.getProperties( controls[ i ].controls, kwObj ) );
                    }
                }
            }
            return kwObj.filter ? this.filter( out ) : out;
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
        filter : function( arr )
        {
            var out = [];
            while( arr.length > 0 )
            {
                var cur = arr.pop();
                if( cur )
                {
                    out.push( cur );
                }
            }
            return out;
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
            if( this._buttons )
            {
                while( this._buttons.length > 0 )
                {
                    this._buttons.pop().destroy();
                }
            }
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
