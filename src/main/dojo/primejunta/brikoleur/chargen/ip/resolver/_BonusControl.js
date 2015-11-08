define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/topic",
          "dojo/dom-construct",
          "dojo/dom-class",
          "./../_base/NumberInput",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dojo/text!./templates/_BonusControl.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          on,
          topic,
          domConstruct,
          domClass,
          NumberInput,
          _WidgetBase,
          _TemplatedMixin,
          template,
          i18n )
{
    return declare( [ _WidgetBase, _TemplatedMixin ], {
        title : "--bonus--",
        templateString : template,
        numbers : [ 0, 1, 2, 3 ],
        bonus : 0,
        max : 0,
        maxButtons : 4,
        buildRendering : function()
        {
            this.inherited( arguments );
            this.createButtons();
        },
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
        setBonus : function( bonus )
        {
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
            this.bonus = bonus;
            topic.publish( "/ResolveTask/", this, true );
        },
        setMax : function( max )
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
        set : function( prop, val )
        {
            if( prop == "max" )
            {
                this.setMax( val );
            }
            else
            {
                this.inherited( arguments );
            }
        }
    } );
} );