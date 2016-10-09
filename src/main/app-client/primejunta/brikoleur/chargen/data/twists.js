/**
 * Twists.
 */
define([ "./twists/gen",
         "./twists/poseidonian",
         "./twists/spacer",
         "./twists/genius",
         "./twists/connected",
         "./twists/spiritual",
         "./twists/chipped" ],
function( gen,
          poseidonian,
          spacer,
          genius,
          connected,
          spiritual,
          chipped )
{
    return {
        "name": "Twist",
        "closed": false,
        "list": [ gen,
                  poseidonian,
                  spacer,
                  genius,
                  connected,
                  spiritual,
                  chipped ]
    }
});