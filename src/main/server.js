/**
 * Boilerplate for booting up a Node.js app written in Dojo. This will pull up Dojo, then the bootstrap for the server
 * app (app-server/server.js).
 */
// Configuration parameters.
var config = require( "config" );
// The module to bootstrap.
var loadModule = "app-server/primejunta/_base/bootstrap";
// Configuration Object for Dojo Loader:
dojoConfig = {
    baseUrl : "./", // Where we will put our packages
    async : 1, // We want to make sure we are using the "modern" loader
    hasCache : {
        "host-node" : 1, // Ensure we "force" the loader into Node.js mode
        "dom" : 0 // Ensure that none of the code assumes we have a DOM
    },
    // While it is possible to use config-tlmSiblingOfDojo to tell the
    // loader that your packages share the same root path as the loader,
    // this really isn't always a good idea and it is better to be
    // explicit about our package map.
    packages : [
        {
            name : "dojo",
            location : config.get( "paths" ).dojo + "/dojo" // This is an external dependency.
        },
        {
            name : "app",
            location : "app"
        },
        {
            name : "app-server",
            location : "app-server"
        },
        {
            name : "app-client",
            location : "app-client"
        }],
    deps : [ loadModule ] // An array of modules to load on "boot"
};
// Now load the Dojo loader
require( config.get( "paths" ).dojo + "/dojo/dojo.js" );
