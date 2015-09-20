define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/topic",
        "dojo/dom-geometry",
        "dojo/dom-construct",
        "dijit/layout/ContentPane" ],
function( declare,
          lang,
          array,
          topic,
          domGeometry,
          domConstruct,
          ContentPane )
{
    return declare([ ContentPane ],
    {
        columnMinWidth : 600,
        buildRendering : function()
        {
            this.inherited( arguments );
            this._cols = [];
            this._placed = [];
            this._cur = 0;
        },
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/PaneToggled/", lang.hitch( this, this._checkReLayout ) ) );
        },
        resize : function()
        {
            this.inherited( arguments );
            this._layoutColumns();
        },
        addChild : function( child, position )
        {
            this._placed.push( child.domNode || child );
            if( this._cols.length == 0 )
            {
                this._layoutColumns();
            }
            if( this._cols.length == 0 )
            {
                return;
            }
            this._placeChild( child, position );
        },
        _placeChild : function( child, position )
        {
            var dn = child.domNode || child;
            domConstruct.place( dn, this._cols[ this._cur ] );
            if( ( child.domNode || child ).style.display != "none" )
            {
                this._cur++;
            }
            if( this._cur > this._cols.length - 1 )
            {
                this._cur = 0;
            }
        },
        _checkReLayout : function( pane, hide )
        {
            if( array.indexOf( this.getChildren(), pane ) != -1 )
            {
                this._layoutColumns( true );
            }
        },
        _layoutColumns : function( force )
        {
            var w = domGeometry.getContentBox( this.domNode ).w;
            if( w == 0 )
            {
                return;
            }
            var n = Math.ceil( w / this.columnMinWidth ) || 1;
            var vChld = 0;
            for( var i = 0; i < this._placed.length; i++ )
            {
                if( this._placed[ i ].style.display != "none" )
                {
                    vChld++;
                }
            }
            if( n > vChld )
            {
                n = vChld;
            }
            if( force || n != this._cols.length )
            {
                this._emptyColumns();
                this._createColumns( n );
            }
        },
        _emptyColumns : function()
        {
            while( true )
            {
                var _has = false;
                for( var i = 0; i < this._cols.length; i++ )
                {
                    var col = this._cols[ i ];
                    if( col.childNodes[ 0 ] )
                    {
                        col.childNodes[ 0 ].parentNode.removeChild( col.childNodes[ 0 ] );
                        col._has =  !!col.childNodes[ 0 ];
                    }
                    _has = _has || col._has;
                }
                if( !_has )
                {
                    break;
                }
            }
            while( this._cols.length > 0 )
            {
                domConstruct.destroy( this._cols.pop() );
            }
        },
        _createColumns : function( n )
        {
            this._cur = 0;
            var w = ( 100 / n );
            while( n > 0 )
            {
                this._cols.push( domConstruct.create( "div", { "class" : "br-dynamicGridColumn", "style" : "width:" + w + "%"}, this.domNode ) );
                n--;
            }
            for( var i = 0; i < this._placed.length; i++ )
            {
                this._placeChild( this._placed[ i ] );
            }
        }
    });
});