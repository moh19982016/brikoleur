/**
 * Widget which adapts to screen size dynamically, laying out sub-panes in one or more columns depending on available
 * width.
 *
 * @public Widget
 */
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
        /**
         * Minimum width for column. If it drops below this point, the number of columns is dropped by 1.
         *
         * @public int
         */
        columnMinWidth : 600,
        /**
         * Inherited, then initialize private properties and subscribe to /PaneToggled/ with _checkReLayout.
         *
         * @public void
         */
        buildRendering : function()
        {
            this.inherited( arguments );
            this._cols = [];
            this._placed = [];
            this._cur = 0;
            this.own( topic.subscribe( "/PaneToggled/", lang.hitch( this, this._checkReLayout ) ) );
        },
        /**
         * Inherited, then _layoutColumns.
         *
         * @public void
         */
        resize : function()
        {
            this.inherited( arguments );
            this._layoutColumns();
        },
        /**
         * Adds child.domNode to ._placed array. If we have no columns, ._layoutColumns which will place it along with
         * the others. Else ._placeChild.
         *
         * @param child
         * @param position
         * @public void
         */
        addChild : function( /* _FeaturePaneBase */ child, /* int */ position )
        {
            this._placed.push( child.domNode || child );
            if( this._cols.length == 0 )
            {
                this._layoutColumns();
            }
            else
            {
                this._placeChild( child, position );
            }
        },
        /**
         * Places child in current column and augments ._cur, or sets it back to 0 if we were already at the last
         * column.
         *
         * @param child
         * @param position - NOT IMPLEMENTED YET
         * @private void
         */
        _placeChild : function( /* _FeaturePaneBase */ child, /* int */ position )
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
        /**
         * If pen isn't already a child widget, ._layoutColumns to rearrange them.
         *
         * @param pane
         * @private void
         */
        _checkReLayout : function( /* _FeaturePaneBase */ pane )
        {
            if( array.indexOf( this.getChildren(), pane ) != -1 )
            {
                this._layoutColumns( true );
            }
        },
        /**
         * Calculate column widths based on available space and number of visible children. If we have the wrong number
         * of columns or force is set, ._emptyColumns and ._createColumns.
         *
         * @param force
         * @private void
         */
        _layoutColumns : function( /* boolean */ force )
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
        /**
         * Remove the domNodes of all placed panes, then destroy column nodes.
         *
         * @private void
         */
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
        /**
         * Create n columns of 100/n % width.
         *
         * @param n
         * @private void
         */
        _createColumns : function( /* int */ n )
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