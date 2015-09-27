/**
 * Traits. Apart from the standard fields (name,
description, list), traits have the following properties:
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
            "description" : "The Akoto Interface allows you to jack into Q-Space.",
            "powers": [
                {
                    "name": "Zoutis",
                    "list": [
                        {
                            "name": "Blast",
                            "description": "Area attack with zam’s base damage on an Immediate area. Standard difficulty.",
                            "list": [
                                {
                                    "name": "Improved Blast",
                                    "extra_cost": 4,
                                    "description": "Area attack on a Small area, with extra Mind points spent added to zam’s damage. Difficulty of attack lowered by 1.",
                                    "list": [
                                        {
                                            "name": "Expert Blast",
                                            "extra_cost": 4,
                                            "description": "Area attack on a Medium area which ignores friendly targets, with extra Mind cost added to zam’s damage. Difficulty of attack lowered by 2.",
                                            "list": [
                                                {
                                                    "name": "Master Blast",
                                                    "extra_cost": 6,
                                                    "description": "Area attack on a Large area which ignores friendly targets, with extra Mind cost added to zam’s damage. Difficulty of attack lowered by 3."
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "Suppress Defences",
                            "description": "Attacks against the target are 1 level easier for the next round.",
                            "list": [
                                {
                                    "name": "Persistent Suppress Defences",
                                    "extra_cost": 1,
                                    "description": "As Suppress Defences, but lasts for 1 round/Mind spent.",
                                    "list": [
                                        {
                                            "name": "Empowered Suppress Defences",
                                            "extra_cost": 4,
                                            "description": "As Suppress Defences, but makes attacks an additional 1 level easier for each 4 Mind points spent.",
                                            "list": [
                                                {
                                                    "name": "Master Suppress Defences",
                                                    "extra_cost": 2,
                                                    "description": "As Suppress Defences, but every 2 Mind spent will either extend the duration or lower the difficulty of the attacks by 1 additional round or level."
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "Shield",
                            "description": "Defence rolls for the target brikoleur or esprí are 1 level easier for the next round.",
                            "list": [
                                {
                                    "name": "Persistent Shield",
                                    "extra_cost": 1,
                                    "description": "As Shield, but lasts for 1 round/Mind spent.",
                                    "list": [
                                        {
                                            "name": "Empowered Shield",
                                            "extra_cost": 4,
                                            "description": "As Shield, but makes defence rolls an additional 1 level easier for each 4 Mind points spent.",
                                            "list": [
                                                {
                                                    "name": "Master Shield",
                                                    "extra_cost": 2,
                                                    "description": "As Shield, but every 2 Mind spent will either extend the duration or lower the difficulty of the defence rolls by 1 additional round or level."
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "Boost",
                            "extra_cost": 6,
                            "description": "Reduces the difficulty of the following action by 1 level per extra 6 Mind spent. Can be combined with any action, including zoutis and fwés.",
                            "list": [
                                {
                                    "name": "Improved Boost",
                                    "extra_cost": 4,
                                    "description": "As Boost, but reduces the difficulty by 1 level per 4 Mind spent, up to 2 levels.",
                                    "list": [
                                        {
                                            "name": "Expert Boost",
                                            "extra_cost": 3,
                                            "description": "As Improved Boost, but reduces the difficulty by 1 level per 3 Mind spent, up to 3 levels.",
                                            "list": [
                                                {
                                                    "name": "Master Boost",
                                                    "extra_cost": 2,
                                                    "description": "As Improved Boost, but reduces the difficulty by 1 level per 2 Mind spent, up to 4 levels."
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "Dig",
                            "description": "Attacks a Wall or other Q-Space feature in touching range for 4 damage. Normal attack roll against the target’s Level must be made.",
                            "list": [
                                {
                                    "name": "Sap",
                                    "extra_cost": 4,
                                    "description": "As Dig, but for 4 extra damage/Mind point spent, and lowers the difficulty of the attack by 1.",
                                    "list": [
                                        {
                                            "name": "Tunnel",
                                            "extra_cost": 4,
                                            "description": "As Dig, but for 4 extra damage/Mind point spent, and effective up to a Small area at Long range, and lowers the difficulty of the attack by 2.",
                                            "list": [
                                                {
                                                    "name": "Demolish",
                                                    "extra_cost": 4,
                                                    "description": "As Tunnel, but for 4 extra damage/Mind point spent, effective on a Large area at Extreme range, and lowers the difficulty of the attack by 3."
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "Hide",
                            "description": "The subject is only detected by brikoleurs or security systems if the player fails a defence roll against their level. Lasts until detected or ended.",
                            "list": [
                                {
                                    "name": "Improved Hide",
                                    "description": "As Hide, but the defence roll is 1 level easier.",
                                    "list": [
                                        {
                                            "name": "Expert Hide",
                                            "extra_cost": 1,
                                            "description": "As Improved Hide, but each extra Mind point lowers the difficulty of the defence roll by 1.",
                                            "list": [
                                                {
                                                    "name": "Group Hide",
                                                    "description": "As Expert Hide, but conceals the entire group of the brikoleur."
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "Slow",
                            "description": "Ranged area attack on Small area. Requires normal attack roll. All affected brikoleurs and esprís lose 1 AP for the next round.",
                            "list": [
                                {
                                    "name": "Extended Slow",
                                    "extra_cost": 3,
                                    "description": "As Slow, but lasts for 1 round/3 Mind spent.",
                                    "list": [
                                        {
                                            "name": "Freeze",
                                            "extra_cost": 3,
                                            "description": "As Extended Slow, but affected targets lose 2 AP.",
                                            "list": [
                                                {
                                                    "name": "Paralyse",
                                                    "extra_cost": 3,
                                                    "description": "As Freeze, but affected targets lose all their AP."
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "Burn",
                            "extra_cost": 1,
                            "description": "Ranged attack on a single target. Affected target suffers 1 point of damage per Mind spent for 1 round per Mind spent. Victim makes another Defence roll each round to end the effect.",
                            "list": [
                                {
                                    "name": "Improved Burn",
                                    "extra_cost": 1,
                                    "description": "As Burn, but difficulty of Defence is raised by 1 level.",
                                    "list": [
                                        {
                                            "name": "Area Burn",
                                            "extra_cost": 1,
                                            "description": "As Improved Burn, but affects an Immediate area.",
                                            "list": [
                                                {
                                                    "name": "Inferno",
                                                    "extra_cost": 1,
                                                    "description": "As Area Burn, but affects a Small area."
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
                    "description": "Fwés are single-use artefacts used in Q-Space.",
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
                    "description": "Esprís are autonomous Q-Space constructs. They are reusable unless destroyed.",
                    "list": []
                }
            ],
            "features": [
                {
                    "name": "Jack In",
                    "value": "You may jack into Q-Space at an exposed Q-Net node, unless you have an Oga slotted.",
                    "type": "passive"
                },
                {
                    "name": "Oga",
                    "value": "Oga are skill packages that give the equivalent of Knack + Training in a single skill. You may not jack in while one is slotted. It takes 24 hours for an oga to integrate.",
                    "type": "passive"
                }
            ]
        },
        {
            "name": "Lwa's Horse",
            "description": "A Lwa's Horse is crowned with a lwa. He serves it, and in turn may petition it for favours. Lwa's Horses are respected by their friends and feared by their enemies.",
            "features" : [{
                "name" : "Respect",
                "type" : "passive",
                "value" : "All interactions involving Power Relations are 1 level easier."
            }],
            "ohun": [
                {
                    "name": "Vévés",
                    "min_level": 0,
                    "type": "ad-hoc",
                    "verb": "inscribe",
                    "description": "Vévés are drawn on the spot. Santeros invoke their lwa with them."
                },
                {
                    "name": "Zombies",
                    "type": "persistent",
                    "description": "Santeros can turn humans and animals into zombies by use of Q-tech scrolls.",
                    "list": []
                },
                {
                    "name": "Golems",
                    "type": "persistent",
                    "description": "Santeros can turn drones into golems by use of Q-tech scrolls.",
                    "list": []
                }
            ]
        },
        {
            "name": "Contra-Synchronicity",
            "description": "Guns pointed at you will misfire. You can manipulate probabilities. You can create and use Cards to produce persistent effects distorting probabilities. You can acquire special abilities that produce specific and powerful CS effects.",
            "features" : [{
                "name" : "Deck",
                "type" : "passive",
                "value" : "A Player with a Deck may play Cards ad-hoc, without having to prepare them in advance."
            }],
            "ohun": [
                {
                    "name": "Cards",
                    "description" : "Cards manipulate probabilities.",
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
        },
        {
            "name": "Military Neural Interface",
            "description": "You have been implanted with a NATO or Almaz-Norinco standard military neural interface by a former employer. You retain the interface and the possibility to implant further military-grade wetware.",
            "features": [
                {
                    "name": "Smart Weapons",
                    "value": "You may use Smart Weapons with a compatible interface.",
                    "type" : "passive"
                }
            ],
            "ohun": [
                {
                    "name": "Drones",
                    "description": "Drones are remote-controlled devices driven through the MNI.",
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
                    "description": "Mil-grade wetware can enhance the user's capabilities. Many do not require Mind points to use.",
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
        },
        {
            "name" : "Genetically Engineered - Aquatic",
            "description" : "Aquatics are humans engineered for life in ocean habitats. Most are associated with the Poseidonian movement.",
            "features" : [
                {
                    "name" : "Bonus knack",
                    "value" : "Aquatic activities",
                    "type" : "knack"
                },
                {
                    "name" : "Adaptation",
                    "value" : "Aquatic - May breathe underwater if sufficient dissolved oxygen is present.",
                    "type" : "passive"
                },
                {
                    "name" : "Resistance",
                    "value" : "4/Temperature and pressure",
                    "type" : "resistance"
                }
            ]
        },
        {
            "name" : "Genetically Engineered - Spacer",
            "description" : "Spacers are humans who have undergone modification to cope better with low-gravity, high-radiation outer space habitats.",
            "features" : [
                {
                    "name" : "Bonus knack",
                    "value" : "Zero-Gee activities",
                    "type" : "knack"
                },
                {
                    "name" : "Adaptation",
                    "value" : "Resilient - Functions normally when Wounded.",
                    "type" : "passive"
                },
                {
                    "name" : "Adaptation",
                    "value" : "Hibernate - Survives Incapacitation for 24 hours. May be revived if dead from hypoxia or hypothermia and body is frozen.",
                    "type" : "passive"
                },
                {
                    "name" : "Resistance",
                    "value" : "3/Gas, temperature, pressure, radiation.",
                    "type" : "resistance"
                }
            ]
        },
        {
            "name" : "Genetically Engineered - Jagun",
            "description" : "Jagun are genetically enhanced super-warriors. They are faster, stronger, and tougher than baseline humans.",
            "features" : [
                {
                    "name" : "Bonus knack",
                    "value" : "Close Combat",
                    "type" : "knack"
                },
                {
                    "name" : "Adaptation",
                    "value" : "Damage Bonus - 4/Melee Damage",
                    "type" : "passive"
                },
                {
                    "name" : "Resistance",
                    "value" : "4/Kinetic",
                    "type" : "resistance"
                }
            ]
        },
        {
            "name" : "Genetically Engineered",
            "description" : "Genetically engineered humans have various adaptations, resistances, and special abilities baseline humans lack, and a bonus knack related to their engineering.",
            "features" : [
                {
                    "name" : "Bonus knack",
                    "value" : false,
                    "type" : "knack"
                },
                {
                    "name" : "Adaptations and Resistances",
                    "type" : "free",
                    "max" : 4
                }
            ]
        },
        {
            "name" : "Zonetouched",
            "description" : "The Zonetouched have been altered by the powers in the Zone. They manifest Gifts and Curses that set them apart from the rest of humanity.",
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
        }
    ]
});