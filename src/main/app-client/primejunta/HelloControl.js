define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "dijit/form/Button",
          "dijit/form/Textarea",
          "dijit/form/TextBox",
          "app/primejunta/_base/json-request",
          "dijit/Tooltip",
          "./_base/CloudClient",
          "dijit/_WidgetBase" ],
function( declare,
          lang,
          on,
          Button,
          Textarea,
          TextBox,
          jsonRequest,
          Tooltip,
          CloudClient,
          _WidgetBase )
{
    return declare( [ _WidgetBase, CloudClient ], {
        authorizationEndpoint : "/login.html",
        returnUrl : "/hello.html",
        apiUrl : "brikoleur",
        _defaultData : {
            name : "cook",
            hello : "Stay in the kitchen!"
        },
        buildRendering : function()
        {
            this.inherited( arguments );
            this._idInput = new TextBox( { style : "display:block;", value : "cook" } ).placeAt( this.domNode );
            this._dataInput = new Textarea( { style : "display:block;", value : JSON.stringify( this._defaultData, false, 2 ) } ).placeAt( this.domNode );
            new Button({ label : "Create", "class" : "alt-warning", onClick : lang.hitch( this, this.createItem ) } ).placeAt( this.domNode );
            new Button({ label : "Retrieve", "class" : "alt-primary", onClick : lang.hitch( this, this.retrieveItem ) } ).placeAt( this.domNode );
            new Button({ label : "Error", "class" : "alt-danger", onClick : lang.hitch( this, this.makeBadRequest ) } ).placeAt( this.domNode );
        },
        createItem : function()
        {
            var data = this._getInputData();
            if( !data )
            {
                alert( "Invalid input data." );
            }
            else
            {
                this.createObject( "things", data ).then( lang.hitch( this, this._handleCreateResult ) );
            }
        },
        retrieveItem : function()
        {
            this.retrieveObjects( "things", this._idInput.get( "value" ) ).then( lang.hitch( this, this._handleRetrieveResult ) );
        },
        makeBadRequest : function()
        {
            this.call( { action_str : "create", data_type : "object", request_map : { collection_name : "things",  object_id : false } } );
            jsonRequest.post( this.apiUrl, { "json" : "This is a random JSON object basically" });
        },
        _getInputData : function()
        {
            try
            {
                return JSON.parse( this._dataInput.get( "value" ) );
            }
            catch( e )
            {
                return false;
            }
        },
        _handleCreateResult : function( result )
        {
            console.log( "GOT", result );
            //this._idInput.set( "value", result.dfasljkasdf )
        },
        _handleRetrieveResult : function( result )
        {
            console.log( "GOT", result );
            //this._dataInput.set( "value", result
        }
    } );
} );