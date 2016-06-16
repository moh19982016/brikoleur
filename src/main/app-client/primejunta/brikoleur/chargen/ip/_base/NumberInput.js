/**
 * Touchscreen-friendly number input, letting you set a number quickly from a list.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/dom-class",
          "dijit/popup",
          "dijit/TooltipDialog",
          "dijit/_WidgetBase" ],
function( declare,
          lang,
          on,
          domClass,
          popup,
          TooltipDialog,
          _WidgetBase )
{
    return declare( [ _WidgetBase ], {
        /**
         * The numbers provided.
         *
         * @public int[]
         */
        numbers : [ 0, 1, 2, 3, 4, 5, 6 ],
        /**
         * Current value.
         *
         * @public int
         */
        value : 0,
        /**
         * Setup CSS, inherited, then set onClick listener.
         *
         * @public void
         */
        postCreate : function()
        {
            domClass.add( this.domNode, "br-bonusButton br-numberInput" );
            this.inherited( arguments );
            this.own( on( this.domNode, "click", lang.hitch( this, this.onClick ) ) );
        },
        /**
         * Stop evt, then show popup with numbers and set on.once listener to read the number when it's clicked.
         *
         * @param evt
         * @public void
         */
        onClick : function( /* Event */ evt )
        {
            evt.stopPropagation();
            var dlog = this._createPopup();
            popup.open( { popup : dlog, around : this.domNode } );
            this.onChange( this.value );
            this.own( on.once( dlog.domNode, "click", lang.hitch( this, function( evt )
            {
                if( !isNaN( parseInt( evt.target.innerHTML ) ) )
                {
                    this.set( "value", parseInt( evt.target.innerHTML ) );
                }
            } ) ) );
            this.own( on.once( document.body, "click", lang.hitch( this, function( evt )
            {
                popup.close( dlog );
                dlog.destroy();
                this.onChange( this.value );
            } ) ) );
        },
        /**
         * Stub. Fires when the user changes the value.
         *
         * @stub
         * @public void
         */
        onChange : function()
        {
        },
        /**
         * Interecept "value" to update display with it.
         *
         * @param prop
         * @param val
         * @public void
         */
        set : function( /* string */ prop, /* {*} */ val )
        {
            if( prop == "value" )
            {
                this.domNode.innerHTML = val;
            }
            this.inherited( arguments );
        },
        /**
         * Creates and returns TooltipDialog containing bubbles for .numbers.
         *
         * @private TooltipDialog
         */
        _createPopup : function()
        {
            var content = "<div class='br-numberSelector'>";
            for( var i = 0; i < this.numbers.length; i++ )
            {
                content += '<div class="br-bonusButton' + ( this.value == this.numbers[ i ] ? " br-bonusSelected" : "" ) + '">' + this.numbers[ i ] + '</div>';
            }
            content += "</div>";
            return new TooltipDialog( {
                content : content
            } );
        }
    } );
} );