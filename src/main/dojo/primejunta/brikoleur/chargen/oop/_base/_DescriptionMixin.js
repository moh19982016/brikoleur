define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dom-construct",
        "dojo/dom-geometry",
        "dojo/dom-class",
        "./../../_base/util",
        "dojo/i18n!./../../../nls/CharGen" ],
function( declare,
          lang,
          on,
          domConstruct,
          domGeometry,
          domClass,
          util,
          i18n )
{
    return declare([], {
        toggleDescription : function()
        {
            this._open ? this.hideDescription() : this.showDescription();
        },
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
        _processDescription : function( descr )
        {
            var subs = this._collectSubstitutions( descr );// /\$\{([^}]+)\}/g.exec( descr );
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
        _collectSubstitutions : function( str )
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