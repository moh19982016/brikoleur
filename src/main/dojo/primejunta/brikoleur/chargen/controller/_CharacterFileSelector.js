define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/_base/array",
          "dojo/json",
          "dojo/dom-construct",
          "dijit/form/CheckBox",
          "./CharacterStore",
          "./../_base/util",
          "./../_base/_FileUploader",
          "dojo/i18n!./../../nls/CharGen" ],
function( declare,
          lang,
          array,
          json,
          domConstruct,
          CheckBox,
          CharacterStore,
          util,
          _FileUploader,
          i18n )
{
    return declare( [ _FileUploader ], {
        uploadMessage : i18n.PleaseSelectCharacterFile,
        style : "min-width:350px;",
        manager : {},
        processFile : function( file )
        {
            var reader = new FileReader();
            reader.onload = lang.hitch( this, function()
            {
                this._processData( reader.result );
            } );
            reader.readAsText( file );
        },
        displayResult : function( message )
        {
            domConstruct.empty( this.messageNode );
            if( typeof message == "string" )
            {
                this.messageNode.innerHTML = message;
            }
            else
            {
                domConstruct.place( message, this.messageNode );
            }
        },
        _processData : function( fileData )
        {
            try
            {
                var chars = json.parse( fileData );
                var keys = CharacterStore.list();
                var div = domConstruct.create( "div" );
                for( var i = 0; i < chars.length; i++ )
                {
                    var manager = this.manager;
                    var name = chars[ i ].name.characterName;
                    var present = ( array.indexOf( keys, name ) != -1 );
                    var row = domConstruct.create( "label", {
                        "class" : "br-characterListItem" + ( present ? " br-characterPresent" : "" )
                    }, div );
                    new CheckBox( {
                        value : name, checked : !present, onChange : function()
                        {
                            manager.selected[ this.value ] = this.checked;
                        }
                    } ).placeAt( row );
                    this.manager.selected[ name ] = !present;
                    domConstruct.create( "span", {
                        innerHTML : name + ( present ? " (" + i18n.CharacterPresent + ")" : "" )
                    }, row );
                }
                this.manager.characterData = chars;
                this.displayResult( div );
            }
            catch( e )
            {
                this.displayResult( i18n.FileDidNotContainCharacters );
            }
        }
    } );
} );