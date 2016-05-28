/**
 * Extends _FieldBase with an increment button letting you buy points for it, and connected to available juju.
 *
 * @private Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/topic",
          "./../../_base/_FieldBase",
          "dijit/form/Button",
          "dijit/form/NumberTextBox",
          "./../../_base/util" ],
function( declare,
          lang,
          on,
          topic,
          _FieldBase,
          Button,
          NumberTextBox,
          util )
{
    return declare( [ _FieldBase ], {
        /**
         * The input widget is a NumberTextBox.
         *
         * @final
         * @public NumberTextBox
         */
        inputWidget : NumberTextBox,
        /**
         * The class makes it a circle.
         *
         * @final
         * @public string
         */
        inputClass : "br-statField",
        /**
         * Juju cost for augmenting it.
         *
         * @final
         * @public int
         */
        cost : 0,
        /**
         * Inherited, then subscribe to /PleasePublishInfo/. If there's a .cost associated with the stat, set readonly
         * to true and create a Button at ._incrementButton to buy it. Then set a listener for changes to
         * .publishInfo.
         *
         * @public void
         */
        buildRendering : function()
        {
            this.inherited( arguments );
            if( this.cost )
            {
                this._input.set( "readonly", true );
                this._incrementButton =
                new Button( {
                    label : '<span class="br-stackedButtonLabel">'
                            + '<span class="fa-stack">'
                            + '<i class="fa fa-square fa-stack-2x br-blue"></i>'
                            + '<i class="fa-stack-1x fa-inverse br-stackedButtonLabelText">1</i>'
                            + '</span>'
                            + '</span>',
                    onClick : lang.hitch( this, this.buyPoint ),
                    "class" : "br-smallButton br-hideInPlay"
                } ).placeAt( this.controlNode );
                this.own( this._incrementButton,
                topic.subscribe( "/StatChanged/-juju", lang.hitch( this, function( juju )
                {
                    this._incrementButton.domNode.style.display = juju < this.cost ? "none" : "unset";
                } ) ) );
            }
            this.own( topic.subscribe( "/PleasePublishInfo/", lang.hitch( this, this.publishInfo ) ),
            on( this._input, "change", lang.hitch( this, function( val )
            {
                if( !Controller.loading )
                {
                    this.publishInfo();
                }
            } ) ) );
        },
        /**
         * Publish a topic with /StatChanged/- plus the name of the stat, with the value.
         *
         * @public void
         */
        publishInfo : function()
        {
            topic.publish( "/StatChanged/-" + this.name, this.get( "value" ) );
        },
        /**
         * Stop the event, then augment value of self and subtract from juju. If there's not enough juju, show a warning
         * instead (this shouldn't happen as the + button should be disabled in that case, but better safe than sorry.)
         *
         * @param evt
         * @public void
         */
        buyPoint : function( /* Event */ evt )
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
    } );
} );