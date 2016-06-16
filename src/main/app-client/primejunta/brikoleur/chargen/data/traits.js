/**
 * Traits.
 */
define([ "./traits/akoto",
        "./traits/cs",
         "./traits/genius",
         "./traits/gen",
        "./traits/gen_aquatic",
        "./traits/gen_jagun",
        "./traits/gen_spacer",
        "./traits/lwas_horse",
        "./traits/mni",
        "./traits/zonetouched" ],
function( akoto,
          cs,
          genius,
          gen,
          gen_aquatic,
          gen_jagun,
          gen_spacer,
          lwas_horse,
          mni,
          zonetouched )
{
    return {
        "name": "Trait",
        "closed": true,
        "list": [ akoto,
                  lwas_horse,
                  cs,
                  mni,
                  genius,
                  gen,
                  gen_spacer,
                  gen_aquatic,
                  gen_jagun,
                  zonetouched ]
    }
});