define({
    name : "Stunt",
    list : [
        {
            "name": "Suppressive Fire",
            "description": "Targets enemy who is behind cover. A successful attack causes the target to lose 1 AP for the next round. A critical success causes loss of all AP’s for the next round.",
            "list": [
                {
                    "name": "Improved Suppressive Fire",
                    "description": "As Suppressive Fire, but every 2 Body points spent extends AP loss by 1 round.",
                    "list": [
                        {
                            "name": "Expert Suppressive Fire",
                            "description": "As Suppressive Fire, but a successful attack also does half damage.",
                            "list": [
                                {
                                    "name": "Master Suppressive Fire",
                                    "description": "As Expert Suppressive Fire, but a successful attack causes loss of 2 AP and full damage."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Sniper Shot",
            "description": "Uses 2 AP, but does double damage. Only applies to organic enemies. Can only be used with Medium Ranged Weapons. Cannot be used with burst or full-auto fire.",
            "list": [
                {
                    "name": "Improved Sniper Shot",
                    "description": "As Sniper Shot, but only uses 1 AP.",
                    "list": [
                        {
                            "name": "Expert Sniper Shot",
                            "description": "As Improved Sniper Shot, but attack is 1 level easier.",
                            "list": [
                                {
                                    "name": "Master Sniper Shot",
                                    "description": "As Expert Sniper Shot, but ignores Armour."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Watch",
            "description": "Instead of attacking, the player watches an enemy combatant who is behind cover. When the enemy emerges to move or fire, the player gets an attack with a difficulty lowered by 1 level.",
            "list": [
                {
                    "name": "Improved Watch",
                    "description": "As Watch, but a critical hit also prevents the enemy from moving or firing.",
                    "list": [
                        {
                            "name": "Expert Watch",
                            "description": "As Improved Watch, but a normal hit prevents the enemy from moving or firing.",
                            "list": [
                                {
                                    "name": "Master Watch",
                                    "description": ": As Expert Watch, but lowers the difficulty of the riposte attack by two levels."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Roll",
            "description": "You roll a Short distance from cover to cover. Defending against all attacks while you move is 1 level easier.",
            "list": [
                {
                    "name": "Dodge",
                    "description": "Defending against all attacks is 1 level easier for 1 round, regardless of what you do.",
                    "list": [
                        {
                            "name": "Improved Roll",
                            "description": "As Roll, but defending against attacks is 3 levels easier, and the effect lasts for 2 rounds.",
                            "list": [
                                {
                                    "name": "Improved Dodge",
                                    "description": "As Dodge, but defending against attacks is 3 levels easier, and the effect lasts for 2 rounds."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Focus",
            "description": "Your intense concentration negates one level of any circumstantial penalty to actions in combat imposed by the GM. Lasts one round.",
            "list": [
                {
                    "name": "Improved Focus",
                    "description": "Your intense concentration negates all circumstantial penalties to actions in combat imposed by the GM. Lasts one round.",
                    "list": [
                        {
                            "name": "Battle Trance",
                            "description": "As above, but all combat actions are one level easier.",
                            "list": [
                                {
                                    "name": "Master Battle Trance",
                                    "description": "As above, but lasts for the duration of the entire battle."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Burst of Strength",
            "description": "Any combat actions involving strength are 1 level easier.",
            "list": [
                {
                    "name": "Adrenalin Burst",
                    "description": "Any combat actions involving strength or speed are 1 level easier.",
                    "list": [
                        {
                            "name": "Improved Adrenalin Burst",
                            "description": "Any combat actions involving strength or speed are 2 levels easier.",
                            "list": [
                                {
                                    "name": "Blood Rage",
                                    "description": "As Improved Adrenalin Burst, but lasts the entire duration of the fight."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Restrain",
            "description": "An unarmed melee attack which does no damage, but a critical hit immobilises the opponent in a joint lock. Both the attacker and the opponent lose all actions for the next round. The opponent may attempt to break free thereafter, and the attacker may end the lock at any time. May only be used on humans.",
            "list": [
                {
                    "name": "Improved Restrain",
                    "description": "As Restrain, but the opponent is immobilised on a normal hit.",
                    "list": [
                        {
                            "name": "Immobilise",
                            "description": "As Improved Restrain, but the attacker may act on the opponent the next round, for example to handcuff or further attack him.",
                            "list": [
                                {
                                    "name": "Stun",
                                    "description": "A successful hit stuns the enemy for 2 rounds. The attacker is free to act normally."
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});