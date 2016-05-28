define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/dom-style",
          "dojo/dom-geometry",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dojo/text!./templates/Switch.html" ],
function( declare,
          lang,
          domStyle,
          domGeometry,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare( [ _WidgetBase, _TemplatedMixin ], {
        templateString : template,
        state : false,
        style : "",
        leftLabel : "On",
        rightLabel : "Off",
        startup : function()
        {
            this.domNode.style = this.style;
            domStyle.set( this.domNode, { "position" : "relative" });
            this._switchWidth = 116; //domGeometry.getContentBox( this.domNode ).w / 2 - 15;
            this._checkState();
        },
        onClick : function () {},
        _checkState : function()
        {
            if( !this.state )
            {
                this.leftButton.style.width = this._switchWidth + "px";
                this.switchDivider.style.left = this._switchWidth + "px";
                this.rightButton.style.width = "0";
            }
            else
            {
                this.leftButton.style.width = "0";
                this.switchDivider.style.left = "0";
                this.rightButton.style.width = this._switchWidth + "px";
            }
        },
        _onClick : function()
        {
            if( !this.state )
            {
                this.state = true;
                this._checkState();
            }
            else
            {
                this.state = false;
                this._checkState();
            }
            this.onClick();
        }
    } );
} );