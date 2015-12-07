define({
    "name": "Akoto Interface",
    "description" : "The Akoto Interface allows you to jack into Q-Space.",
    "link" : "#AkotoInterface",
    "powers": [
        {
            "name": "Zoutis",
            "description": "Zoutis are Powers used in Q-Space.",
            "link" : "#PowersZoutis",
            "list": [
                {
                    "name": "Blast",
                    "description": "Area attack with zam’s base damage on an Immediate area. Standard difficulty.",
                    "list": [
                        {
                            "name": "Improved Blast",
                            "extra_cost": 1,
                            "description": "Area attack on a Small area, with extra Mind points spent added to zam’s damage. Difficulty of attack lowered by 1.",
                            "list": [
                                {
                                    "name": "Expert Blast",
                                    "extra_cost": 1,
                                    "description": "Area attack on a Medium area which ignores friendly targets, with extra Mind cost added to zam’s damage. Difficulty of attack lowered by 2.",
                                    "list": [
                                        {
                                            "name": "Master Blast",
                                            "extra_cost": 1,
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
                    "extra_cost": 4,
                    "description": "Reduces the difficulty of the following action by 1 level per extra 4 Mind spent. Can be combined with any action, including zoutis and fwés.",
                    "list": [
                        {
                            "name": "Improved Boost",
                            "extra_cost": 3,
                            "description": "As Boost, but reduces the difficulty by 1 level per 3 Mind spent, up to 2 levels.",
                            "list": [
                                {
                                    "name": "Expert Boost",
                                    "extra_cost": 2,
                                    "description": "As Improved Boost, but reduces the difficulty by 1 level per 2 Mind spent, up to 3 levels.",
                                    "list": [
                                        {
                                            "name": "Master Boost",
                                            "extra_cost": 1,
                                            "description": "As Improved Boost, but reduces the difficulty by 1 level per 1 Mind spent, up to 4 levels."
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
                                            "extra_cost": 1,
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
            "link" : "#OhunFws",
            "list": [
                {
                    "name": "Armour",
                    "level": "$NUMBER",
                    "description": "Increases the user's armour by ${3+level} for ${1+level} rounds."
                },
                {
                    "name": "Damage",
                    "level": "$NUMBER",
                    "description": "Increases the user's zam damage by ${3+level} for ${1+level} rounds."
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
            "value": "Oga are skill packages that give the equivalent of Knack + Training in a single skill. Only non-combat skills are applicable.",
            "type": "passive"
        },
        {
            "name" : "Bonus knack",
            "value" : "&lt;Oga&gt;",
            "type" : "oga"
        }
    ]
});