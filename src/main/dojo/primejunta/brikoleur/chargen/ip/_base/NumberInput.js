define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/dom-construct",
          "dojo/dom-class",
          "dijit/popup",
          "dijit/TooltipDialog",
          "dijit/_WidgetBase" ],
function( declare,
          lang,
          on,
          domConstruct,
          domClass,
          popup,
          TooltipDialog,
          _WidgetBase )
{
    return declare( [ _WidgetBase ], {
        numbers : [ 0, 1, 2, 3, 4, 5, 6 ],
        value : 0,
        postCreate : function()
        {
            domClass.add( this.domNode, "br-bonusButton br-numberInput" );
            this.inherited( arguments );
            var content = "<div class='br-numberSelector'>";
            for( var i = 0; i < this.numbers.length; i++ )
            {
                content += '<div class="br-bonusButton">' + this.numbers[ i ] + '</div>';
            }
            content += "</div>";
            this._numberDialog = new TooltipDialog( {
                content : content
            } );
            this.own( this._numberDialog );
            this.own( on( this.domNode, "click", lang.hitch( this, this.onClick ) ) );
        },
        onClick : function( evt )
        {
            evt.stopPropagation();
            popup.open( { popup : this._numberDialog, around : this.domNode } );
            this.onChange( this.value );
            this.own( on.once( this._numberDialog.domNode, "click", lang.hitch( this, function( evt )
            {
                if( !isNaN( parseInt( evt.target.innerHTML ) ) )
                {
                    this.set( "value", parseInt( evt.target.innerHTML ) );
                }
            } ) ) );
            this.own( on.once( document.body, "click", lang.hitch( this, function( evt )
            {
                popup.close( this._numberDialog );
                this.onChange( this.value );
            } ) ) );
        },
        onChange : function()
        {
        },
        set : function( prop, val )
        {
            if( prop == "value" )
            {
                this.domNode.innerHTML = val;
            }
            this.inherited( arguments );
        }
    } );
} );