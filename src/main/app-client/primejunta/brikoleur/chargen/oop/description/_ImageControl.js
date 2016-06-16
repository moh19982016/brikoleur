define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/topic",
          "dojo/touch",
          "dijit/form/VerticalSlider",
          "./../../_base/_FileUploader",
          "./../../_base/util",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dojo/text!./templates/_ImageControl.html",
          "dojo/i18n!./../../../nls/CharGen" ],
function( declare,
          lang,
          on,
          topic,
          touch,
          VerticalSlider,
          _FileUploader,
          util,
          WidgetBase,
          TemplatedMixin,
          template,
          i18n )
{
    return declare( [ WidgetBase, TemplatedMixin ], {
        templateString : template,
        width : 150,
        height: 200,
        scale : 2,
        title : i18n.Portrait,
        buildRendering : function()
        {
            this.inherited( arguments );
            this.canvasNode.width = this.width * this.scale;
            this.canvasNode.height = this.height * this.scale;
            this.canvasNode.style.width = this.width + "px";
            this.canvasNode.style.height = this.height + "px";
            this.titleWrapper.style.width = this.width + "px";
            this.imageTitleWrapper.style.width = this.width + "px";
            this._context = this.canvasNode.getContext( "2d" );
            this._fileControl = new _FileUploader({
                style : "width:" + this.width + "px;height:" + this.height + "px",
                accept : "image/*",
                processFile : lang.hitch( this, function( file )
                {
                    var reader = new FileReader();
                    reader.onload = lang.hitch( this, this._prepareCanvas, reader );
                    reader.readAsDataURL( file );
                } )
            }).placeAt( this.fileControlNode );
            this.own( on( this.canvasNode, touch.press, lang.hitch( this, this._startDrag ) ) );
            this.own( on( this.canvasNode, touch.release, lang.hitch( this, this._endDrag ) ) );
            this.own( on( this.canvasNode, touch.leave, lang.hitch( this, this._endDrag ) ) );
            this.own( on( this.canvasNode, touch.move, lang.hitch( this, this._doDrag ) ) );
        },
        pleaseChangeImage : function()
        {
            util.confirm( i18n.ConfirmChangeImage ).then( lang.hitch( this, this.changeImage ) );
        },
        changeImage : function()
        {
            this._fileControl.clear();
            this.imageWrapper.style.display = "none";
            this.controlNode.style.display = "block";
            this.fileControlWrapper.style.display = "block";
            this.canvasWrapper.style.display = "none";
        },
        acceptImage : function()
        {
            this.imageNode.src = this.canvasNode.toDataURL();
            this._displayImage();
            topic.publish( "/PleaseAutoSave/" );
        },
        set : function( prop, val )
        {
            if( prop == "value" )
            {
                if( val )
                {
                    this.imageNode.src = val;
                    this._displayImage();
                }
                else
                {
                    this.value = "";
                    this.changeImage();
                }
            }
            else
            {
                this.inherited( arguments );
            }
        },
        _displayImage : function()
        {
            this.imageNode.style.width = this.width + "px";
            this.imageNode.style.height = this.height + "px";
            this.controlNode.style.display = "none";
            this.imageWrapper.style.display = "block";
            this.value = this.imageNode.src;
        },
        _prepareCanvas : function( reader )
        {
            this.own( on.once( this.imageNode, "load", lang.hitch( this, function()
            {
                var iBox = {
                    w : this.imageNode.width,
                    h : this.imageNode.height
                };
                var scale;
                if( iBox.w / iBox.h > this.width / this.height )
                {
                    scale = this.scale * this.height / iBox.h;
                }
                else
                {
                    scale = this.scale * this.width / iBox.w;
                }
                this.fileControlWrapper.style.display = "none";
                this.canvasWrapper.style.display = "block";
                if( this._scaleSlider )
                {
                    this._scaleSlider.destroy();
                }
                this._scaleSlider = new VerticalSlider({
                    minimum : scale * 100,
                    maximum : 100,
                    value : scale * 100,
                    intermediateChanges : true,
                    onChange : lang.hitch( this, this._drawImage ),
                    style : "height:" + this.height + "px;"
                } ).placeAt( this.canvasControls );
                this._dragOffset = { x : 0, y : 0 };
                this._scaleSlider.startup();
                this._drawImage();
            })));
            this.imageNode.src = reader.result;
        },
        _drawImage : function()
        {
            var scale = this._scaleSlider.get( "value" ) / 100;
            var iBox = {
                w : this.imageNode.width,
                h : this.imageNode.height
            };
            var cBox = {
                w : scale * iBox.w,
                h : scale * iBox.h
            };
            this._offset = {
                x : -0.5 * ( cBox.w - this.canvasNode.width ) + this._dragOffset.x * this.scale,
                y : -0.5 * ( cBox.h - this.canvasNode.height ) + this._dragOffset.y * this.scale
            };
            if( this._offset.x > 0 )
            {
                this._offset.x = 0;
            }
            if( this._offset.x < -1 * ( cBox.w - this.canvasNode.width ) )
            {
                this._offset.x = -1 * ( cBox.w - this.canvasNode.width );
            }
            if( this._offset.y > 0 )
            {
                this._offset.y = 0;
            }
            if( this._offset.y < -1 * ( cBox.h - this.canvasNode.height ) )
            {
                this._offset.y = -1 * ( cBox.h - this.canvasNode.height );
            }
            this._context.drawImage( this.imageNode, this._offset.x, this._offset.y, cBox.w, cBox.h );
        },
        _startDrag : function( evt )
        {
            this._dragging = true;
            this._dragCoords = {
                x : evt.clientX,
                y : evt.clientY
            };
        },
        _endDrag : function( evt )
        {
            this._dragging = false;
        },
        _doDrag : function( evt )
        {
            if( this._dragging )
            {
                this._dragOffset = {
                    x : this._dragOffset.x - ( this._dragCoords.x - evt.clientX ),
                    y : this._dragOffset.y - ( this._dragCoords.y - evt.clientY )
                };
                this._dragCoords = {
                    x : evt.clientX,
                    y : evt.clientY
                };
                this._drawImage();
            }
        }
    } );
} );
