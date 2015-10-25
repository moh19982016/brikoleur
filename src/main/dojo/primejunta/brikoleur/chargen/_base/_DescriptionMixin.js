/**
 * Mixin which adds features for displaying an item description in a togglable node. Requires .descriptionButton,
 * .descriptionWrapper, and .descriptionNode attachPoints.
 *
 * @public Mixin
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/on",
         "dojo/dom-construct",
         "dojo/dom-geometry",
         "dojo/dom-class",
         "dojo/i18n!./../../nls/CharGen" ],
function( declare,
          lang,
          on,
          domConstruct,
          domGeometry,
          domClass,
          i18n )
{
    return declare([], {
        /**
         * Toggles description node depending on ._open property.
         *
         * @public void
         */
        toggleDescription : function()
        {
            this._open ? this.hideDescription() : this.showDescription();
        },
        /**
         * If we have a description to show, set ._open and show it in .descriptionNode. At the same time, make it so
         * .descriptionWrapper slides into view and .descriptionButton icon changes. If there's no description,
         * .hideDescription instead.
         *
         * @public void
         */
        showDescription : function()
        {
            if( this.descriptionWrapper && this.description )
            {
                this._open = true;
                this.descriptionWrapper.style.height = domGeometry.getMarginBox( this.descriptionNode ).h + "px";
                domClass.replace( this.descriptionButton, "fa-chevron-circle-down", "fa-chevron-circle-right" );
                domClass.add( this.domNode, "br-descriptionOpen" );
            }
            else if( !this.description )
            {
                this.hideDescription();
            }
        },
        /**
         * Unset ._open, change descriptionButton icon, and slide .descriptionWrapper out of view.
         *
         * @public void
         */
        hideDescription : function()
        {
            if( this.descriptionWrapper )
            {
                this._open = false;
                domClass.replace( this.descriptionButton, "fa-chevron-circle-right", "fa-chevron-circle-down" );
                domClass.remove( this.domNode, "br-descriptionOpen" );
                this.descriptionWrapper.style.height = "0px";
            }
        },
        /**
         * Constructs HTML from data containing a .description and (optionally) .link (to manual) and places it in
         * .descriptionNode. If there is a description, activates the descriptionButton; else hides it.
         *
         * @param data
         */
        setDescription : function( data )
        {
            this.description = data.description || "";
            if( data.description )
            {
                var val = this._processDescription( data.description );
                this.descriptionNode ? this.descriptionNode.innerHTML = val : false;
                if( data.link )
                {
                    var lnk = domConstruct.create( "a", { className : "br-manualLink", href : Controller.manualUrl + data.link, target : "manualWindow", innerHTML : i18n.MoreInformation + '<i class="fa fa-external-link-square"></i></a>' }, this.descriptionNode );
                    on( lnk, "click", lang.hitch( this, function( evt )
                    {
                        evt.preventDefault();
                        if( !this.manualWindow || this.manualWindow.closed )
                        {
                            this.manualWindow = window.open( evt.target.href, "manualWindow", "toolbar=no" );
                        }
                        else
                        {
                            this.manualWindow.location = evt.target.href;
                        }
                        this.manualWindow.focus();
                    }));
                }
                this.descriptionButton ? this.descriptionButton.style.visibility = "visible" : false;
            }
            else
            {
                this.descriptionNode ? this.descriptionNode.innerHTML = "" : false;
                this.descriptionButton ? this.descriptionButton.style.visibility = "hidden" : false;
            }
        },
        /**
         * Substitutes pattern values into description. We have them so we can show actual level-dependent values when
         * we know the level.
         *
         * @param descr
         * @private string
         */
        _processDescription : function( /* string */ descr )
        {
            var subs = this._collectSubstitutions( descr );
            var reslts = [];
            for( var i = 0; i < subs.length; i++ )
            {
                if( this.level == 0 )
                {
                    reslts.push( subs[ i ] );
                }
                else
                {
                    var delR = /([\/+])/.exec( subs[ i ] );
                    var del = delR ? delR[ 1 ] : false;
                    if( !del )
                    {
                        return descr;
                    }
                    else
                    {
                        var cur = subs[ i ].split( del );
                        switch( del )
                        {
                            case "/" :
                                reslts.push( parseInt( cur[ 0 ] ) * parseInt( this.level ) );
                                break;
                            case "+" :
                                reslts.push( parseInt( cur[ 0 ] ) + parseInt( this.level ) );
                                break;
                        }
                    }
                }
            }
            descr = descr.replace( /\$\{([^}]+)\}/g, "${#}" );
            descr = descr.split( "${#}" );
            var out = "";
            for( var i = 0; i < descr.length; i++ )
            {
                out += descr[ i ] + ( reslts[ i ] || "" );
            }
            return out;
        },
        /**
         * Collects any substitutions we've listed in str and returns them as string[].
         *
         * @param str
         * @private string[]
         */
        _collectSubstitutions : function( /* string */ str )
        {
            var out = [];
            var sub = /\$\{([^}]+)\}/g.exec( str );
            if( sub && sub[ 1 ] )
            {
                out = out.concat( [ sub[ 1 ] ], this._collectSubstitutions( str.substring( str.indexOf( sub[ 1 ] ) + sub[ 1 ].length + 3 ) ) );
            }
            return out;
        }
    });
});