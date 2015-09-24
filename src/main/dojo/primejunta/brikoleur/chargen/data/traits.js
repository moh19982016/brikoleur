/**
 * Traits. Apart from the standard fields (name, description, list), traits have the following properties:
 *
 * ohun
 * powers
 * features
 */
define({
    "name": "Trait",
        "closed": true,
        "list": [
        {
            "name": "Akoto Interface",
            "powers": [
                {
                    "name": "Zoutis",
                    "list": [
                        {
                            "name": "Blast",
                            "mind": 1,
                            "description": "Area attack with the zam’s base damage on an Immediate area. Standard difficulty.",
                            "list": [
                                {
                                    "name": "Improved Blast",
                                    "mind": 4,
                                    "description": "Area attack on a Small area, with Mind cost added to zam’s damage. Difficulty of attack lowered by 1.",
                                    "list": [
                                        {
                                            "name": "Expert Blast",
                                            "mind": 8,
                                            "description": "Area attack on a Medium area which ignores friendly targets, with Mind cost added to zam’s damage. Difficulty of attack lowered by 2.",
                                            "list": [
                                                {
                                                    "name": "Master Blast",
                                                    "mind": 12,
                                                    "description": "Area attack on a Large area which ignores friendly targets, with Mind cost added to zam’s damage. Difficulty of attack lowered by 3."
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            "ohun": [
                {
                    "name": "Fwés",
                    "description": "Fwés are purpose-built artefacts deployed in Q-Space. They are consumed when used.",
                    "list": [
                        {
                            "name": "Armour",
                            "level": "$NUMBER",
                            "description": "Increases the user's armour by ${calc(4 * this.level)} for ${calc( 2 * level)} rounds."
                        },
                        {
                            "name": "Damage",
                            "level": "$NUMBER",
                            "description": "Increases the user's zam damage by ${calc(4 * this.level)} for ${calc( 2 * level )} rounds."
                        }
                    ]
                },
                {
                    "name": "Esprís",
                    "type": "persistent",
                    "description": "Esprís are autonomous Q-Space constructs with a variety of capabilities. They are reusable unless destroyed. Each esprí takes up an ohun slot, whether active or not.",
                    "list": []
                }
            ],
            "features": [
                {
                    "name": "Oga",
                    "description": "Ogas are skill packages slotted into the Akoto interface. It takes 24 hours for an oga to integrate, but can be removed at any time. The user cannot jack into Q-Space when one is slotted.",
                    "list": []
                }
            ]
        },
        {
            "name": "Lwa's Horse",
            "description": "A Lwa's Horse is crowned with a lwa. He serves it, and in turn may petition it for favours. Lwa's Horses are respected by their friends and feared by their enemies.",
            "ohun": [
                {
                    "name": "Vévés",
                    "min_level": 0,
                    "type": "ad-hoc",
                    "verb": "inscribe",
                    "description": "While preparation such as intel can help make them, vévés are drawn in the field. The santero invokes his lwa by drawing a vévé on a suitable surface. They are drawn on the spot. It takes a minimum of 1 round to draw one. Vévés which cost no juju may can be drawn without limitations."
                },
                {
                    "name": "Zombies",
                    "type": "persistent",
                    "description": "Santeros can turn humans or other organics into zombies by connecting a Q-tech Scroll prepared for them by their lwa to their Akoto or Military Neural interface. Each golem accompanying the santero uses one ohun slot."
                },
                {
                    "name": "Golems",
                    "type": "persistent",
                    "description": "Santeros can turn drones into golems by connecting a Q-tech Scroll prepared for them by their lwa to their control module. Each golem accompanying the santero uses one ohun slot."
                }
            ]
        },
        {
            "name": "Contra-Synchronicity",
            "description": "Guns pointed at you will misfire. You can manipulate probabilities. You can create and use Cards to produce persistent effects distorting probabilities. You can acquire special abilities that produce specific and powerful CS effects.",
            "ohun": [
                {
                    "name": "Cards",
                    "list": [
                        {
                            "name": "Protect against firearms",
                            "type": "persistent",
                            "description": "The card will cause guns fired at the individual or in a Small area to misfire on a roll of (card level) on a d6."
                        },
                        {
                            "name": "Suppress Contra-Synchronicity",
                            "type": "persistent",
                            "description": "Suppresses any Contra-Synchronicity effects in the area up to (card level)."
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
                    "list": [
                        {
                            "name": "Load the Dice",
                            "description": " Adjusts the difficulty of any action down by one level. Full action.",
                            "list": [
                                {
                                    "name": "Improved Load the Dice ",
                                    "description": "Adjusts the difficulty of any action down by one level per starting 4 Mind points spent, for a maximum of 2 levels. Full action.",
                                    "list": [
                                        {
                                            "name": "Expert Load the Dice ",
                                            "description": "As above, for a maximum of 3 levels.",
                                            "list": [
                                                {
                                                    "name": "Master Load the Dice",
                                                    "description": " As above, for a maximum of 4 levels."
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
                                    "description": " When used as an action, one firearm of the character’s choice per 4 Mind spent misfires. Automatic action at level 0, action otherwise).",
                                    "list": [
                                        {
                                            "name": "Expert Misfire ",
                                            "description": "As above, except the weapon also jams; clearing the jam takes a full round.",
                                            "list": [
                                                {
                                                    "name": "Master Misfire ",
                                                    "description": "As above, except that if 16 Mind is spent, all firearms belonging to hostile characters in a Large area jam."
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
                                    "description": "The Player produces a Temporary <a href=\"#doc272\">Level 1 Card effect</a>, as if she had played an Ohun to the same effect. The duration is 1 round + 1 round per extra 4 Mind spent. Requires <a href=\"#doc273\">Deck</a>.",
                                    "list": [
                                        {
                                            "name": "Empowered Instantaneous Card Effect ",
                                            "description": "The Player produces an <a href=\"#doc272\">Instantaneous Card Effect</a> at 1 level / 4 Mind spent. Requires <a href=\"#doc273\">Deck</a>.",
                                            "list": [
                                                {
                                                    "name": "Empowered Temporary Card Effect ",
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
        },
        {
            "name": "Military Neural Interface",
            "description": "You have been implanted with a NATO or Almaz-Norinco standard military neural interface by a former employer. You retain the interface and the possibility to implant further military-grade wetware.",
            "features": [
                {
                    "name": "Smart Weapons",
                    "description": "You may use Smart Weapons with a compatible interface."
                }
            ],
            "ohun": [
                {
                    "name": "Drones",
                    "list": [
                        {
                            "name": "Microdrone"
                        },
                        {
                            "name": "Light Drone"
                        },
                        {
                            "name": "Medium Drone"
                        },
                        {
                            "name": "Heavy Drone"
                        },
                        {
                            "name": "Combat Drone"
                        },
                        {
                            "name": "Avatar"
                        },
                        {
                            "name": "Power Armour"
                        }
                    ]
                }
            ],
            "powers": [
                {
                    "name": "Military Grade Wetware",
                    "list": [
                        {
                            "name": "Enhanced senses",
                            "list": []
                        },
                        {
                            "name": "Data services",
                            "list": []
                        },
                        {
                            "name": "Implanted light weapon",
                            "list": []
                        },
                        {
                            "name": "Sub-dermal armour",
                            "list": []
                        },
                        {
                            "name": "Enhanced strength",
                            "list": []
                        },
                        {
                            "name": "Enhanced speed",
                            "list": []
                        },
                        {
                            "name": "Neural block",
                            "description": "Wounded characters function as normal. Incapacitated characters function as Wounded.",
                            "list": []
                        },
                        {
                            "name": "Combat Stimulants",
                            "list": []
                        }
                    ]
                }
            ]
        }
    ]
});
