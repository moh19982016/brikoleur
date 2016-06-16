/**
 * Mixin providing features for loading and saving characters.
 *
 * @private Mixin
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/_base/array",
          "dojo/on",
          "dojo/topic",
          "dojo/string",
          "dojo/dom-construct",
          "dojo/Deferred",
          "dojo/json",
          "dijit/registry",
          "dijit/form/CheckBox",
          "./../_base/util",
          "./_CharacterUploader",
          "./_CharacterPrint",
          "./CharacterStore",
          "dojo/i18n!./../../nls/CharGen" ],
function( declare,
          lang,
          array,
          on,
          topic,
          string,
          domConstruct,
          Deferred,
          json,
          registry,
          CheckBox,
          util,
          _CharacterUploader,
          _CharacterPrint,
          CharacterStore,
          i18n )
{
    return declare( [], {
        /**
         * Calls .saveCharacter, then .clear().
         *
         * @public void
         */
        newCharacter : function()
        {
            this.saveCharacter().then( lang.hitch( this, this.clear ), function() {} );
        },
        /**
         * If dontSave is set, goes directly to doLoadCharacter, else goes via .saveCharacter.
         *
         * @param name
         * @param dontSave
         * @public void
         */
        loadCharacter : function( /* string */ name, /* boolean */ dontSave )
        {
            if( !dontSave )
            {
                this.saveCharacter().then( lang.hitch( this, this.doLoadCharacter, name ) );
            }
            else
            {
                this.doLoadCharacter( name );
            }
        },
        /**
         * Stores name of currently loaded character in settings store, then sets juju from it, and sets state of self
         * to character data matching name.
         *
         * @param name
         */
        doLoadCharacter : function( /* string */ name )
        {
            CharacterStore.set( "character", name );
            this.set( "is_new", false );
            this.set( "juju", CharacterStore.get( "juju" ) || 0 );
            this.set( "state", CharacterStore.load( name ) );
        },
        /**
         * If name is not in use, return true.
         *
         * @param name
         * @public boolean
         */
        isValidName : function( name )
        {
            return !CharacterStore.nameInUse( name );
        },
        /**
         * Call .validateCharacter, then .doSaveCharacter. If silent, no alerts will be raised.
         *
         * @param silent
         * @public Deferred
         */
        saveCharacter : function( /* boolean */ silent )
        {
            silent = silent === true;
            return this.validateCharacter( silent ).then( lang.hitch( this, this.doSaveCharacter ), function() { return new Deferred().reject() } );
        },
        /**
         * Get character name from name pane, then update juju to match the amount spent, then save it CharacterStore.
         * Publish a topic announcing the even, .refreshEkip, and return and resolve a Deferred.
         *
         * @public Deferred
         */
        doSaveCharacter : function()
        {
            var cName = this.characterPane.panes.name.get( "state" ).characterName;
            var juju = this.get( "juju" );
            if( !this.is_new )
            {
                CharacterStore.set( "juju", juju );
            }
            this.set( "is_new", false );
            CharacterStore.save( cName, this.get( "state" ) );
            topic.publish( "/CharacterSaved/" );
            this.refreshEkip();
            this.playButton.set( "disabled", false );
            return new Deferred().resolve();
        },
        /**
         * Asks each pane to validate itself. If none of them return errors, check if juju needs to be spent to apply
         * changes, and ask user to confirm is so, otherwise resolve and return a Deferred. If errors were found,
         * display an alert to that effect, and reject and return a Deferred.
         *
         * @public Deferred
         */
        validateCharacter : function( silent )
        {
            var reslts = [];
            for( var o in this.characterPane.panes )
            {
                var reslt = this.characterPane.panes[ o ].validate ?
                this.characterPane.panes[ o ].validate() :
                { valid : true };
                if( reslt.valid != true )
                {
                    reslts.push( reslt.message );
                }
            }
            if( reslts.length > 0 )
            {
                if( !silent )
                {
                    util.alert( i18n.NotReadyToSave + "<ul><li>" + reslts.join( "</li><li>" ) + "</li></ul>" );
                }
                return new Deferred().reject();
            }
            else
            {
                var juju = this.get( "juju" ) || 0;
                var diff = ( CharacterStore.get( "juju" ) || 0 ) - juju;
                if( this.is_new && juju > 0 )
                {
                    if( !silent )
                    {
                        util.alert( i18n.YouHaveUnusedJuju );
                    }
                    return new Deferred().reject();
                }
                else if( diff == 0 || this.is_new )
                {
                    return new Deferred().resolve(); //( cName, juju );
                }
                else
                {
                    if( !silent )
                    {
                        return util.confirm( string.substitute( i18n.ConfirmSpendJuju, { juju : diff } ) );
                    }
                    else
                    {
                        return new Deferred().reject();
                    }
                }
            }
        },
        /**
         * Delete character matching the currently loaded one from CharacterStore if the user confirms the action,
         * then .refreshEkip and clear().
         *
         * @public void
         */
        deleteCharacter : function()
        {
            var charName = this.characterPane.panes.name.get( "state" ).characterName;
            var keys = CharacterStore.list();
            if( charName && array.indexOf( keys, charName ) != -1 )
            {
                util.confirm( string.substitute( i18n.ConfirmDeleteCharacter,
                { charName : charName } ) ).then( lang.hitch( this, function()
                {
                    CharacterStore.remove( charName );
                    this.refreshEkip();
                    this.clear();
                } ) );
            }
            else
            {
                this.clear();
            }
        },
        /**
         * If a character is loaded, reload it from the store.
         *
         * @public void
         */
        revertCharacter : function()
        {
            if( this.characterPane.panes.name.get( "state" ).characterName )
            {
                this.loadCharacter( this.characterPane.panes.name.get( "state" ).characterName, true );
            }
        },
        downloadCharacters : function()
        {
            var keys = CharacterStore.list();
            var div = domConstruct.create( "div", { style: "min-width:300px;" } );
            var link = domConstruct.create( "a",
            {
                "class" : "br-downloadCharactersLink",
                download : "characterStore.json",
                "innerHTML" : '<i class="fa fa-download"></i> ' + i18n.Download,
                "style" : "display:none;"
            },
            domConstruct.create( "div", {} ) );
            for( var i = 0; i < keys.length; i++ )
            {
                var name = CharacterStore.load( keys[ i ] ).name.characterName;
                var row = domConstruct.create( "label", { "class" : "br-characterListItem" }, div );
                var cb = new CheckBox( { value : keys[ i ] } ).placeAt( row );
                on( cb, "change", lang.hitch( this, this._updateDownloadLink, div, link ) );
                domConstruct.create( "span", { innerHTML : name }, row );
            }
            domConstruct.place( link, div );
            util.confirm( div, [ { label : i18n.Done, value : false } ], i18n.Download );
        },
        uploadCharacters : function()
        {
            if( !this._uploader )
            {
                this._uploader = new _CharacterUploader({ manager : this });
                this.own( this._uploader );
            }
            this._uploader.start();
        },
        printCharacter : function()
        {
            var print = new _CharacterPrint({ manager : this.characterPane }).placeAt( document.body );
            on.once( document.body, "click", lang.hitch( this, function()
            {
                print.destroy();
            }));
            window.print();
            print.destroy();
        },
        setUpSync : function()
        {
        },
        _updateDownloadLink : function( div, link )
        {
            var boxes = registry.findWidgets( div );
            var data = [];
            for( var i = 0; i < boxes.length; i++ )
            {
                if( boxes[ i ].get( "checked" ) )
                {
                    data.push( CharacterStore.load( boxes[ i ].value ) );
                }
            }
            if( data.length > 0 )
            {
                link.href = "data:application/json;charset=utf-8," + encodeURIComponent( json.stringify( data ) );
                link.style.display = "block";
            }
            else
            {
                link.style.display = "none";
            }
        }
    } );
} );