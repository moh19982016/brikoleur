define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/topic",
        "./_FieldBase",
        "dijit/form/Button",
        "dijit/form/NumberTextBox",
        "./util" ],
function( declare,
          lang,
          on,
          topic,
          _FieldBase,
          Button,
          NumberTextBox,
          util )
{
    return declare([ _FieldBase ], {
        inputWidget : NumberTextBox,
        cost : 0,
        buildRendering : function()
        {
            this.inherited( arguments );
            if( this.cost )
            {
                this._input.set( "readonly", true );
                this._incrementButton = new Button({ label : "<i class='fa fa-plus-square'></i>", onClick: lang.hitch( this, this.buyPoint ) } ).placeAt( this.controlNode );
                topic.subscribe( "/StatChanged/-juju", lang.hitch( this, function( juju )
                {
                    this._incrementButton.domNode.style.display = juju < this.cost  ? "none" : "unset";
                }))
            }
            this.own( on( this._input, "change", lang.hitch( this, function( val )
            {
                topic.publish( "/StatChanged/-" + this.name, val );
            })));
        },
        buyPoint : function( evt )
        {
            evt.stopPropagation();
            if( Controller.get( "juju" ) < this.cost )
            {
                util.showWarning( i18n.notEnoughJuju, this.controlNode );
            }
            else
            {
                this.set( "value", this.get( "value" ) + 1 );
                Controller.set( "juju", Controller.get( "juju" ) - this.cost );
            }
        }
    });
});