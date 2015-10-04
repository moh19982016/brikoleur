/**
 * Mixin providing features for loading and saving characters.
 *
 * @private Mixin
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "dojo/string",
         "dojo/Deferred",
         "./../oop/_base/util",
         "./CharacterStore",
         "dojo/i18n!./../../nls/CharGen" ],
function( declare,
          lang,
          topic,
          string,
          Deferred,
          util,
          CharacterStore,
          i18n )
{
    return declare([], {
        /**
         * Calls .saveCharacter, then .clear().
         *
         * @public void
         */
        newCharacter : function()
        {
            this.saveCharacter().then( lang.hitch( this, this.clear ));
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
                this.saveCharacter().then( lang.hitch( this, this.doLoadCharacter, name ));
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
         * Call .validateCharacter, then .doSaveCharacter.
         *
         * @public Deferred
         */
        saveCharacter : function()
        {
            return this.validateCharacter().then( lang.hitch( this, this.doSaveCharacter ) );
        },
        /**
         * Get character name from name pane, then update juju to match the amount spent, then save it CharacterStore.
         * Publish a topic announcing the even, ._refreshEkip, and return and resolve a Deferred.
         *
         * @public Deferred
         */
        doSaveCharacter : function()
        {
            var cName = this.panes.name.get( "state" ).characterName;
            var juju = this.get( "juju" );
            if( !this.is_new )
            {
                CharacterStore.set( "juju", juju );
            }
            this.set( "is_new", false );
            CharacterStore.save( cName, this.get( "state" ) );
            topic.publish( "/CharacterSaved/" );
            this._refreshEkip();
            return new Deferred().resolve();
        },
        /**
         * Asks each pane to validate itself. If none of them return errors, check if juju needs to be spent to apply
         * changes, and ask user to confirm is so, otherwise resolve and return a Deferred. If errors were found,
         * display an alert to that effect, and reject and return a Deferred.
         *
         * @public Deferred
         */
        validateCharacter : function()
        {
            var reslts = [];
            for( var o in this.panes )
            {
                var reslt = this.panes[ o ].validate ? this.panes[ o ].validate() : { valid : true };
                if( reslt.valid != true )
                {
                    reslts.push( reslt.message );
                }
            }
            if( reslts.length > 0 )
            {
                util.alert( i18n.NotReadyToSave + "<ul><li>" + reslts.join( "</li><li>" ) + "</li></ul>" );
                return new Deferred().reject();
            }
            else
            {
                var juju = this.get( "juju" ) || 0;
                var diff = ( CharacterStore.get( "juju" ) || 0 ) - juju;
                if( this.is_new && juju > 0 )
                {
                    util.alert( i18n.YouHaveUnusedJuju );
                    return new Deferred().reject();
                }
                else if( diff == 0 || this.is_new )
                {
                    return new Deferred().resolve(); //( cName, juju );
                }
                else
                {
                    return util.confirm( string.substitute( i18n.ConfirmSpendJuju, { juju : diff } ) );
                }
            }
        },
        /**
         * Delete character matching the currently loaded one from CharacterStore if the user confirms the action,
         * then ._refreshEkip and clear().
         *
         * @public void
         */
        deleteCharacter : function()
        {
            var charName = this.panes.name.get( "state" ).characterName;
            var keys = CharacterStore.list();
            if( charName && array.indexOf( keys, charName ) != -1 )
            {
                util.confirm( string.substitute( i18n.ConfirmDeleteCharacter, { charName : charName } ) ).then( lang.hitch( this, function()
                {
                    CharacterStore.remove( charName );
                    this._refreshEkip();
                    this.clear();
                }));
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
            if( this.panes.name.get( "state" ).characterName )
            {
                this.loadCharacter( this.panes.name.get( "state" ).characterName, true );
            }
        }
    });
});