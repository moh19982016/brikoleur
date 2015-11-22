/**
 * Mixin which lets you spend points from a stat when doing something.
 *
 * @public Mixin
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dojo/topic",
          "dojo/string",
          "dijit/popup",
          "dijit/TooltipDialog" ],
function( declare,
          lang,
          on,
          topic,
          string,
          popup,
          TooltipDialog )
{
    return declare( [], {
        /**
         * Stat powering the ability. Must be defined when used.
         *
         * @public string
         */
        stat : "",
        /**
         * Fire when using a power. Stop evt, open popup with numbers for cost, set listeners for it.
         *
         * @param evt
         * @public void
         */
        pleaseUsePower : function( /* Event */ evt )
        {
            evt.stopPropagation();
            var dlog = this._createTooltipDialog();
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
        /**
         * Create a numbers dialog for power cost. We need to figure this out from the stat in use and the power being
         * used.
         *
         * @private TooltipDialog
         */
        _createTooltipDialog : function()
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