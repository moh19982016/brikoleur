/**
 * Archetypes. Used from splash screen to make character creation a little easier.
 */
define([ "./archetypes/brikoleur",
         "./archetypes/flyer",
         "./archetypes/grunt",
         "./archetypes/ronin",
         "./archetypes/santero",
         "./archetypes/xman",
         "./archetypes/_custom" ],
function( brikoleur,
          flyer,
          grunt,
          ronin,
          santero,
          xman,
          _custom )
{
    return {
    "name": "Archetypes",
        "closed": true,
        "list": [ brikoleur, flyer, grunt, ronin, santero, xman, _custom ]
    }
});