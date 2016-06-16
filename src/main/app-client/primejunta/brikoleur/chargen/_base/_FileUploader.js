define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/dom-construct",
          "dojo/dom-class",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dojo/text!./templates/_FileUploader.html",
          "dojo/i18n!./../../nls/CharGen" ],
function( declare,
          lang,
          on,
          domConstruct,
          domClass,
          _WidgetBase,
          _TemplatedMixin,
          template,
          i18n )
{
    return declare( [ _WidgetBase, _TemplatedMixin ], {
        dict : i18n,
        templateString : template,
        accept : "application/json",
        uploadInfoMessage : "",
        /**
         * UI method connected to "select a file" link. Fires a synthetic click on .fileInput to open the file browser.
         *
         * @param evt
         * @public void
         */
        pleaseSelectFile : function( /* Event */ evt )
        {
            this._recreateFileInput();
            this.fileInput.click();
            evt.preventDefault();
        },
        /**
         * Fires when a file has been selected. If there is one, calls .processFile on it.
         *
         * @public void
         */
        fileSelected : function()
        {
            if( this.fileInput.files.length > 0 )
            {
                this.fileMessageNode.innerHTML = this.fileInput.files[ 0 ].name;
                domClass.add( this.domNode, "br-fileSelected" );
                this.processFile( this.fileInput.files[ 0 ] );
            }
        },
        /**
         * Stub. Do something with the file.
         *
         * @param file
         */
        processFile : function( /* File */ file )
        {
        },
        /**
         * Restores control to factory state.
         *
         * @public void
         */
        clear : function()
        {
            domClass.remove( this.domNode, "br-fileSelected" );
            this.fileMessageNode.innerHTML = i18n.PleaseSelectFile;
        },
        /**
         * If we already have a file input, remove its onchange listener and destroy it. Then create one at .domNode,
         * add a listener for its change event, and set its properties.
         *
         * This is a workaround to a browser bug that manifests at least in Chrome and MSIE.
         *
         * @private void
         */
        _recreateFileInput : function()
        {
            if( this.fileInput )
            {
                this._fileInputListener.remove();
                domConstruct.destroy( this.fileInput );
            }
            this.fileInput = domConstruct.create( "input", { type : "file", style : "display:none", accept : this.accept  }, this.domNode );
            this._fileInputListener = on( this.fileInput, "change", lang.hitch( this, this.fileSelected ) );
        }
    } );
} );