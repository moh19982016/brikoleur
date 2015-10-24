define({
    "name": "Counter-Synchronicity",
    "description": "Guns pointed at you will misfire. You can manipulate probabilities. You can create and use Cards to produce persistent effects distorting probabilities. You can acquire special abilities that produce specific and powerful CS effects.",
    "link": "#doc88",
    "features" : [{
        "name" : "Deck",
        "type" : "passive",
        "value" : "A Player with a Deck may play Cards ad-hoc, without having to prepare them in advance."
    }],
    "ohun": [
        {
            "name": "Cards",
            "description" : "Cards manipulate probabilities.",
            "link": "#doc272",
            "list": [
                {
                    "name": "Protect against firearms",
                    "type": "persistent",
                    "description": "The card will cause guns fired at the individual or in a Small area to misfire on a roll of (card level) on a d6."
                },
                {
                    "name": "Suppress Counter-Synchronicity",
                    "type": "persistent",
                    "description": "Suppresses any Counter-Synchronicity effects in the area up to (card level)."
                },
                {
                    "name": "Good or Bad luck",
                    "type": "instantaneous",
                    "description": "Modify all friendly or hostile die rolls up by (card level) for one round"
                },
                {
                    "name": "Guarantee Success",
                    "type": "instantaneous",
                    "description": "Treat the next roll as if you rolled a 6. Higher-level cards reduce the difficulty by 1 per level over 1."
                },
                {
                    "name": "Buy Luck",
                    "type": "persistent",
                    "description": "Imposes a malus on rolls by one group or person, and transfers it to another group or person as a bonus."
                },
                {
                    "name": "Rob Luck",
                    "type": "persistent",
                    "description": "As Buy Luck, but does not require victim's cooperation, and only works on other Players. See <a href=\"#doc272\">Cards</a> for details."
                },
                {
                    "name": "Counter Play",
                    "type": "instantaneous",
                    "description": "Played as a Reaction, attempts to counter a hostile instantaneous CS effect."
                },
                {
                    "name": "Lucky Break",
                    "type": "instantaneous",
                    "description": "An uncertainty is resolved in a way favourable to the player."
                }
            ]
        }
    ],
    "powers": [
        {
            "name": "Plays",
            "description": "Plays are Powers which bend probabilities.",
            "link": "#doc271",
            "list": [
                {
                    "name": "Load the Dice",
                    "description": " Adjusts the difficulty of any action down by one level. Full action.",
                    "list": [
                        {
                            "name": "Improved Load the Dice ",
                            "extra_cost" : 4,
                            "description": "As above, but every 4 extra Mind spent lowers difficulty by an additional level.",
                            "list": [
                                {
                                    "name": "Expert Load the Dice ",
                                    "extra_cost" : 3,
                                    "description": "As above, but additional levels only cost 3 Mind.",
                                    "list": [
                                        {
                                            "name": "Master Load the Dice",
                                            "extra_cost" : 2,
                                            "description": " As above, but additional levels only cost 2 Mind."
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Misfire ",
                    "description": "Any firearm aimed and fired at the character misfires. Automatic action.",
                    "list": [
                        {
                            "name": "Improved Misfire",
                            "extra_cost" : 2,
                            "description": " One firearm of the character’s choice per extra 2 Mind spent misfires.",
                            "list": [
                                {
                                    "name": "Expert Misfire ",
                                    "extra_cost" : 2,
                                    "description": "As above, except the weapon also jams; clearing the jam takes a full round.",
                                    "list": [
                                        {
                                            "name": "Master Misfire ",
                                            "extra_cost" : 8,
                                            "description": "As above, except that if extra 8 Mind is spent, all firearms belonging to hostile characters in a Large area jam."
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Malfunction ",
                    "description": "Any mechanical or electronic device of level 1-2 of the character’s choice within a short distance will malfunction. This will jam a mechanical lock, cause a motor to shut down, a light fixture to go out, a computer to halt, and so on.",
                    "list": [
                        {
                            "name": "Improved Malfunction",
                            "description": " As above, but applies to devices up to level 3. ",
                            "list": [
                                {
                                    "name": "Expert Malfunction",
                                    "description": " As above, but applies to devices up to level 4. ",
                                    "list": [
                                        {
                                            "name": "Master Malfunction",
                                            "description": " As above, but applies to devices up to level 5."
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Instantaneous Card Effect ",
                    "description": "The Player produces an Instantaneous <a href=\"#doc272\">Level 1 Card effect</a>, as if she had played an Ohun to the same effect. Requires <a href=\"#doc273\">Deck</a>.",
                    "list": [
                        {
                            "name": "Temporary Card Effect ",
                            "extra_cost" : 4,
                            "description": "The Player produces a Temporary <a href=\"#doc272\">Level 1 Card effect</a>, as if she had played an Ohun to the same effect. The duration is 1 round + 1 round per extra 4 Mind spent. Requires <a href=\"#doc273\">Deck</a>.",
                            "list": [
                                {
                                    "name": "Empowered Instantaneous Card Effect ",
                                    "extra_cost" : 4,
                                    "description": "The Player produces an <a href=\"#doc272\">Instantaneous Card Effect</a> at 1 level / 4 Mind spent. Requires <a href=\"#doc273\">Deck</a>.",
                                    "list": [
                                        {
                                            "name": "Empowered Temporary Card Effect ",
                                            "extra_cost" : 4,
                                            "description": "The Player produces a <a href=\"#doc272\">Temporary Card Effect</a> as above. Every 4 points above 8 extend the duration by one round or raise the power by one level. Requires <a href=\"#doc273\">Deck</a>."
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});