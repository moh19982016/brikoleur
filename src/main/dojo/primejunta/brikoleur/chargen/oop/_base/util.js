/**
 * Collection of commonly used utility methods.
 *
 * @static
 * @public Object
 */
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
        /**
         * Converts list of strings or objects to format suitable for use with Memory data stores.
         *
         * @param list
         * @public Object[]
         */
        listToStoreData : function( /* string[]|Object[] */ list )
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
        /**
         * Shows message warning in tooltip around aroundNode, with aroundDir passed to it.
         *
         * @param warning
         * @param aroundNode
         * @param aroundDir
         */
        showWarning : function( /* string */ warning, /* Element */ aroundNode, /* string[] */ aroundDir )
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
        /**
         * Looks for item matching path in data, and returns item prop in it if found. Example:
         *
         * <code>
         * util.queryData( knacks, [ "Ranged Combat", "Pistol" ], "name" );
         * </code>
         *
         * @param data
         * @param path
         * @param prop
         * @public string[]
         */
        queryData : function( /* Object */ data, /* string[] */ path, /* string */ prop )
        {
            var out = [];
            var list = data instanceof Array ? data : data[ "list" ] || data[ "controls" ];
            var seg = path.shift();
            for( var i = 0; i < list.length; i++ )
            {
                if( list[ i ].name == seg )
                {
                    if( path.length > 0 )
                    {
                        out = out.concat( this.queryData( list[ i ], path, prop ) );
                    }
                    else
                    {
                        var items = list[ i ][ "list" ] || list[ i ][ "controls" ];
                        for( var j = 0; j < items.length; j++ )
                        {
                            if( items[ j ][ prop ] )
                            {
                                out.push( items[ j ][ prop ] );
                            }
                        }
                    }
                    break;
                }
            }
            return out;
        },
        /**
         * Removes duplicate items from arr.
         *
         * @param arr
         * @public string[]
         */
        removeDuplicates : function( /* string[] */ arr )
        {
            for( var i = 0; i < arr.length; i++ )
            {
                if( arr[ i + 1 ] && arr[ i ] == arr[ i + 1 ] )
                {
                    arr.splice( i, 1 );
                    i--;
                }
            }
            return arr;
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
         * @public string[]
         */
        getProperties : function( /* FeatureControl[] */ controls, /* Object */ kwObj )
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
        /**
         * Recurses through controls, calling .countItems on each member, and returning the total.
         *
         * @param controls
         * @public int
         */
        countItems : function( /* Widget[] */ controls )
        {
            var n = 0;
            for( var i = 0; i < controls.length; i++ )
            {
                n += controls[ i ].countItems();
            }
            return n;
        },
        /**
         * Removes falsy members from arr and returns the result. Used in connection with .getProperties.
         *
         * @param arr
         * @public Array
         */
        filter : function( /* Array */ arr )
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
        /**
         * Shows alert-like dijit/Dialog with message and title, and returns promise which is resolved once the user
         * has clicked through it.
         *
         * @param message
         * @param title
         * @public Deferred
         */
        alert : function( /* string */ message, /* string? */ title )
        {
            title = title || i18n.DialogTitle;
            return this._showDialog( message, [{ value : true, label : i18n.Continue }], title );
        },
        /**
         * Shows confirm-like dialog with message, options, and title, returning a promise which is resolved or rejected
         * when the user makes his choice.
         *
         * @param message
         * @param options - array of { value, label, className } objects, will appear as buttons, promise will be
         *                  resolved with value unless it's false in which case it'll be rejected
         * @param title
         * @public Deferred
         */
        confirm : function( /* string */ message, /* Object[]? */ options, /* string? */ title )
        {
            title = title || i18n.DialogTitle;
            options = options || [{ value : true, label : i18n.Accept, className : "br-blueButton" }, { value : false, label : i18n.Cancel, className : "br-redButton" }];
            return this._showDialog( message, options, title );
        },
        /**
         * Displays a dialog with title and message, and buttons created from options. Returns a Deferred, which will be
         * resolved or rejected (depending on option.value) when the user clicks on it.
         * 
         * @param message
         * @param options
         * @param title
         * @private Deferred
         */
        _showDialog : function( /* sring */ message, /* Object[] */ options, /* string? */ title )
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
        /**
         * Creates buttons from options with label from .label and className from .className. The onClick event is
         * connected to ._resolveDialog with option.value as argument. Buttons are placed at atNode.
         *
         * @param options
         * @param atNode
         * @private void
         */
        _createButtons : function( /* Object[] */ options, /* Element */ atNode )
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
                out.push( new Button({
                    label : options[ i ].label,
                    onClick : lang.hitch( this, this._resolveDialog, options[ i ].value ),
                    className : options[ i ].className
                } ).placeAt( atNode ) );
            }
        },
        /**
         * Hides dialog, and sets timeout to destroy its contents after animation has completed. If there is a reslt,
         * resolves ._dialogPromise with it, else rejects the promise. This promise was returned when dialog was opened.
         *
         * @param reslt
         * @private void
         */
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
