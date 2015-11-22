/**
 * Control representing a particular bonus. Provides clickable nodes to set it, and handles maxValues for it by graying
 * out values that are past it without changing the setting.
 *
 * @private Control
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/topic",
          "dojo/dom-construct",
          "dojo/dom-class",
          "./../_base/NumberInput",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dojo/text!./templates/_BonusControl.html" ],
function( declare,
          lang,
          on,
          topic,
          domConstruct,
          domClass,
          NumberInput,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare( [ _WidgetBase, _TemplatedMixin ], {
        /**
         * Title. Set by whoever is using this.
         *
         * @public string
         */
        title : "--bonus--",
        /**
         * Array of numbers to provide as buttons.
         *
         * @public int[]
         */
        numbers : [ 0, 1, 2, 3 ],
        /**
         * Current value.
         *
         * @public int
         */
        bonus : 0,
        /**
         * Current maximum value.
         *
         * @public int
         */
        max : 0,
        /**
         * Maximum number of buttons to display.  If there are more, the rest are in a popup.
         *
         * @public int
         */
        maxButtons : 4,
        /**
         * Template.
         *
         * @final
         * @public string
         */
        templateString : template,
        /**
         * Inherited, then .createButtons.
         *
         * @public void
         */
        buildRendering : function()
        {
            this.inherited( arguments );
            this.createButtons();
        },
        /**
         * Create buttons from numbers, either in .buttonsNode or as a NumberInput with the remainder.
         *
         * @public void
         */
        createButtons : function()
        {
            this.buttons = {};
            for( var i = 0; i < this.numbers.length; i++ )
            {
                if( i < this.maxButtons )
                {
                    var btn = domConstruct.create( "div",
                                                   {
                                                       "class" : "br-bonusButton",
                                                       innerHTML : this.numbers[ i ]
                                                   },
                                                   this.buttonsNode );
                    btn.value = this.numbers[ i ];
                    this.own( on( btn, "click", lang.hitch( this, this.setBonus, i ) ) );
                    this.buttons[ "b" + this.numbers[ i ] ] = btn;
                }
                else
                {
                    var btn = new NumberInput( {
                        value : this.numbers[ i ],
                        numbers : this.numbers.splice( i ),
                        onChange : lang.hitch( this, this.setBonus )
                    } ).placeAt( this.buttonsNode );
                    this.own( btn );
                    this.buttons[ "b" + this.numbers[ i ] ] = btn;
                }
            }
            this.setBonus( this.bonus );
            this.setMax( this.max );
        },
        /**
         * Call _setBonus on bonus, and publish /PrepareTask/ as attack action (if it's not really an attack, this will
         * be handled later down the chain).
         *
         * @param bonus
         */
        setBonus : function( bonus )
        {
            this._setBonus( bonus );
            topic.publish( "/PrepareTask/", this, true );
        },
        /**
         * Sets max to max, and grays out any buttons past it.
         *
         * @param max
         * @public void
         */
        setMax : function( /* int */ max )
        {
            max = parseInt( max );
            this.max = max;
            for( var o in this.buttons )
            {
                domClass.remove( this.buttons[ o ], "br-tempBonus" );
                if( this.buttons[ o ].value > max )
                {
                    domClass.add( this.buttons[ o ], "br-disabledBonus" );
                }
                else
                {
                    domClass.remove( this.buttons[ o ], "br-disabledBonus" );
                }
            }
            if( this.bonus > this.max )
            {
                domClass.add( this.buttons[ "b" + this.max ], "br-tempBonus" );
            }
        },
        /**
         * Intercept "max" and "bonus" with .setMax and _setBonus.
         *
         * @param prop
         * @param val
         * @public void
         */
        set : function( /* string */ prop, /* {*} */ val )
        {
            if( prop == "max" )
            {
                this.setMax( val );
            }
            else if( prop == "bonus" )
            {
                this._setBonus( val );
            }
            else
            {
                this.inherited( arguments );
            }
        },
        /**
         * Sets .bonus to bonus, and marks matching button as selected.
         *
         * @param bonus
         * @private void
         */
        _setBonus : function( /* int */ bonus )
        {
            this.bonus = bonus;
            for( var o in this.buttons )
            {
                if( this.buttons[ o ].value == bonus )
                {
                    domClass.add( this.buttons[ o ].domNode || this.buttons[ o ], "br-bonusSelected" );
                }
                else
                {
                    domClass.remove( this.buttons[ o ].domNode || this.buttons[ o ], "br-bonusSelected" );
                }
            }
        }
    } );
} );