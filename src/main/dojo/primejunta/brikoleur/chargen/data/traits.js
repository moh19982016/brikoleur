/**
 * Traits.
 */
define([ "./traits/akoto",
        "./traits/cs",
        "./traits/gen",
        "./traits/gen_aquatic",
        "./traits/gen_jagun",
        "./traits/gen_spacer",
        "./traits/lwas_horse",
        "./traits/mni",
        "./traits/zonetouched" ],
function( akoto,
          cs,
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
                  gen,
                  gen_spacer,
                  gen_aquatic,
                  gen_jagun,
                  zonetouched ]
    }
});