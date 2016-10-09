/**
 * Traits.
 */
define([ "./traits/brikoleur",
         "./traits/cs",
         "./traits/santero",
         "./traits/mni",
         "./traits/zonetouched" ],
function( brikoleur,
          cs,
          santero,
          mni,
          zonetouched )
{
    return {
        "name": "Trait",
        "closed": true,
        "list": [ brikoleur,
                  santero,
                  cs,
                  mni,
                  zonetouched ]
    }
});