/**
 * Task resolver pane.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/topic",
          "dojo/on",
          "dojo/string",
          "dijit/popup",
          "dijit/TooltipDialog",
          "./../../oop/powers/_PowerControl",
          "dojo/text!./templates/_PowerControl.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          on,
          string,
          popup,
          TooltipDialog,
          _PowerControl,
          template,
          i18n )
{
    return declare( [ _PowerControl ],
    {
        stat : "mind",
        popupMessage : i18n.SpendMindPoints,
        statTooLowMessage : i18n.MindTooLow,
        templateString : template,
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( on( this.valueNode, "click", lang.hitch( this, this.pleaseUsePower ) ) );
        },
        pleaseUsePower : function( evt )
        {
            evt.stopPropagation();
            var dlog = this._createNumberDialog();
            popup.open( { popup : dlog, around : this.valueNode } );
            this.own( on.once( dlog.domNode, "click", lang.hitch( this, function( evt )
            {
                if( !isNaN( parseInt( evt.target.innerHTML ) ) )
                {
                    topic.publish( "/PointsSpent/", this.stat, parseInt( evt.target.innerHTML ) );
                }
            } ) ) );
            this.own( on.once( document.body, "click", lang.hitch( this, function( evt )
            {
                popup.close( dlog );
            } ) ) );
        },
        _createNumberDialog : function()
        {
            var bc = this._getUseCost();
            this.numbers = [ bc ];
            var state = this.get( "state" );
            var ec = state.extra_cost;
            var max = Math.min( Controller.get( "aps" ), Controller.inPlayPane.panes.numbers.get( this.stat ) );
            var content;
            while( ec && bc + ec <= max )
            {
                this.numbers.push( bc + ec );
                ec = ec + ec;
            }
            if( max >= bc )
            {
                content = "<div>" +
                              "<div class='br-popupMessage'>" +
                              this.popupMessage +
                              "</div>" +
                              "<div class='br-numberSelector'>";
                for( var i = 0; i < this.numbers.length; i++ )
                {
                    content += '<div class="br-bonusButton">' + this.numbers[ i ] + '</div>';
                }
                content += "</div>" +
                           "</div>";
            }
            else
            {
                content = "<div>" + string.substitute( this.statTooLowMessage, { stat : bc } ) + "</div>";
            }
            return new TooltipDialog( {
                content : content
            } );
        }
    } );
} );