define({
    "name" : "Zonetouched",
    "description" : "The Zonetouched have been altered by the powers in the Zone. They manifest Gifts and Curses that set them apart from the rest of humanity.",
    "link" : "#Zonetouched",
    "ohun" : [],
    "features" : [
        {
            "name" : "Minor Curses",
            "value" : "Minor Curse",
            "selector" : false,
            "type" : "free",
            "max" : 9,
            "list" : [ "Repulsive: -2/Social", "Mute", "Deaf", "Cannibal", "Semiplegic", "Hemiplegic", "Berserk" ]
        },
        {
            "name" : "Major Curses",
            "value" : "Major Curse",
            "selector" : false,
            "type" : "free",
            "max" : 9,
            "list" : [ "Quadriplegic", "Violence-inhibited", "Blind", "Dustman" ]
        },
        {
            "name" : "Gifts",
            "value" : "Gift",
            "selector" : false,
            "type" : "free",
            "list" : [ "Ohun - Fwés",
                "Ohun - Esprís",
                "Ohun - Cards",
                "Ohun - Vévés",
                "Ohun - Zombies",
                "Ohun - Golems",
                "Ohun - Drones",
                "Power - Plays",
                "Power - Military Grade Wetware",
                "Power - Zoutis",
                "Adaptation - Resilient",
                "Adaptation - Hibernation",
                "Jack In",
                "Smart Weapons",
                "Empath",
                "Telepath",
                "Chameleon",
                "Psychic Assault",
                "Machine Empathy" ],
            "checkMax" : function( features )
            {
                return 1 + ( features[ "Minor Curses" ] || [] ).length + 2 * ( features[ "Major Curses" ] || [] ).length;
            }
        }
    ]
});