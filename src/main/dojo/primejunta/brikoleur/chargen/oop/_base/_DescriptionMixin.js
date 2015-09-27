define([ "dojo/_base/declare",
        "dojo/dom-geometry",
        "dojo/dom-class",
        "./../../_base/util" ],
function( declare,
          domGeometry,
          domClass,
          util )
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
                domGeometry.setMarginBox( this.descriptionWrapper, domGeometry.getMarginBox( this.descriptionNode ) );
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
                domGeometry.setMarginBox( this.descriptionWrapper, { h : 0 } );
            }
        }
    });
});