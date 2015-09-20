define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "./_FieldBase",
        "dijit/form/Button",
        "dijit/form/NumberTextBox",
        "./util" ],
function( declare,
          lang,
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
                topic.subscribe( "/JujuChanged/", lang.hitch( this, function( juju )
                {
                    this._incrementButton.domNode.style.display = juju < this.cost  ? "none" : "unset";
                }))
            }
        },
        buyPoint : function( evt )
        {
            evt.stopPropagation();
            if( CharacterGenerator.get( "juju" ) < this.cost )
            {
                util.showWarning( i18n.notEnoughJuju, this.controlNode );
            }
            else
            {
                this.set( "value", this.get( "value" ) + 1 );
                CharacterGenerator.set( "juju", CharacterGenerator.get( "juju" ) - this.cost );
            }
        }
    });
});