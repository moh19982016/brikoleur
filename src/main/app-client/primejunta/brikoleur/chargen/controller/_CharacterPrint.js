define( [ "dojo/_base/declare",
          "./../_base/util",
          "dojo/dom-construct",
          "dijit/_WidgetBase",
          "dijit/_TemplatedMixin",
          "dojo/text!./templates/_CharacterPrint.html" ],
function( declare,
          util,
          domConstruct,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare( [ _WidgetBase, _TemplatedMixin ], {
        manager : {},
        templateString : template,
        postCreate : function()
        {
            var name = util.escape( this.manager.panes.character_name.get( "state" ) );
            this.nameNode1.innerHTML = name;
            this.nameNode2.innerHTML = name;
            for( var o in this.manager.panes )
            {
                if( this[ o + "Node" ] )
                {
                    this.manager.panes[ o ]._origParent = this.manager.panes[ o ].domNode.parentNode;
                    domConstruct.place( this.manager.panes[ o ].domNode, this[ o + "Node" ] );
                }
            }
        },
        destroy : function()
        {
            for( var o in this.manager.panes )
            {
                if( this.manager.panes[ o ]._origParent )
                {
                    domConstruct.place( this.manager.panes[ o ].domNode, this.manager.panes[ o ]._origParent );
                }
            }
            this.inherited( arguments );
        }
    } );
} );