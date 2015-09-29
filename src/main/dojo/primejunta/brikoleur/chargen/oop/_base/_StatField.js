define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/topic",
        "./../../_base/_FieldBase",
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
        inputClass : "br-statField",
        cost : 0,
        buildRendering : function()
        {
            this.inherited( arguments );
            this.own( topic.subscribe( "/PleasePublishStatus/", lang.hitch( this, this.publishStatus ) ) );
            if( this.cost )
            {
                this._input.set( "readonly", true );
                this._incrementButton = new Button({ label : "<i class='fa fa-plus-square br-blue'></i>", onClick: lang.hitch( this, this.buyPoint ), "class" : "br-smallButton" } ).placeAt( this.controlNode );
                this.own( topic.subscribe( "/StatChanged/-juju", lang.hitch( this, function( juju )
                {
                    this._incrementButton.domNode.style.display = juju < this.cost  ? "none" : "unset";
                })));
            }
            this.own( on( this._input, "change", lang.hitch( this, function( val )
            {
                if( !Controller.loading )
                {
                    this.publishStatus();
                }
            })));
        },
        publishStatus : function()
        {
            topic.publish( "/StatChanged/-" + this.name, this.get( "value" ) );
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