define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "./../_base/util",
          "./CharacterStore",
          "./_CharacterFileSelector",
          "dojo/i18n!./../../nls/CharGen" ],
function( declare,
          lang,
          util,
          CharacterStore,
          _CharacterFileSelector,
          i18n )
{
    return declare( [ _CharacterFileSelector ], {
        manager : {},
        start : function()
        {
            this.selected = {};
            this.characterData = [];
            util.confirm( new _CharacterFileSelector( {
                manager : this,
            } ).domNode, false, i18n.Upload ).then( lang.hitch( this,
            this._uploadCharacters ) );
        },
        _uploadCharacters : function()
        {
            var msg = i18n.NoCharactersToSave;
            for( var i = 0; i < this.characterData.length; i++ )
            {
                if( this.selected[ this.characterData[ i ].name.characterName ] )
                {
                    msg = i18n.CharactersSaved;
                    CharacterStore.save( this.characterData[ i ].name.characterName, this.characterData[ i ] );
                }
            }
            this.manager.refreshEkip();
            util.inform( msg );
        }
    } );
} );