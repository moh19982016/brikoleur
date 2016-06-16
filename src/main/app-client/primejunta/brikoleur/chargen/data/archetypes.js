/**
 * Archetypes. Used from splash screen to make character creation a little easier.
 */
define([ "./archetypes/brikoleur",
         "./archetypes/flyer",
         "./archetypes/grunt",
         "./archetypes/poseidonian",
         "./archetypes/ronin",
         "./archetypes/santero",
         "./archetypes/spacer",
         "./archetypes/xman",
         "./archetypes/_custom" ],
function( brikoleur,
          flyer,
          grunt,
          poseidonian,
          ronin,
          santero,
          spacer,
          xman,
          _custom )
{
    return {
    "name": "Archetypes",
        "closed": true,
        "list": [ brikoleur, flyer, grunt, poseidonian, ronin, santero, spacer, xman, _custom ]
    }
});