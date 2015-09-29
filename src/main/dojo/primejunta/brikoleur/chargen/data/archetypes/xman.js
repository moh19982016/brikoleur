define({
    name : "X-Man",
    data : {
        "name": {
            "characterName": ""
        },
        "traits": [
            {
                "name": "Contra-Synchronicity",
                "value": "Contra-Synchronicity",
                "key": false,
                "controls": [],
                "description": "Guns pointed at you will misfire. You can manipulate probabilities. You can create and use Cards to produce persistent effects distorting probabilities. You can acquire special abilities that produce specific and powerful CS effects.",
                "link": "#doc88",
                "id": "Contra-Synchronicity"
            },
            {
                "name": "Trait",
                "value": false,
                "key": false,
                "controls": []
            }
        ],
        "knacks": [
            {
                "name": "Ranged Combat",
                "value": "Ranged Combat",
                "key": false,
                "controls": [
                    {
                        "name": "Medium Ranged Weapons",
                        "value": "Medium Ranged Weapons",
                        "key": false,
                        "controls": [
                            {
                                "name": "Medium Ranged Weapons",
                                "value": false,
                                "key": false,
                                "controls": []
                            }
                        ],
                        "description": "Covers two-handed, rifle-type ranged weapons, including crossbows, but not including heavy weapons such as RPG's, heavy machine guns, or heavy sniper rifles.",
                        "id": "Medium Ranged Weapons"
                    },
                    {
                        "name": "Ranged Combat",
                        "value": false,
                        "key": false,
                        "controls": []
                    }
                ],
                "description": "Training in Ranged Combat adds bonuses to attack with ranged weapons. Ranged Defense is a dedicated skill.",
                "type": "combat",
                "closed": true,
                "id": "Ranged Combat"
            },
            {
                "name": "Knack",
                "value": false,
                "key": false,
                "controls": []
            }
        ],
        "numbers": [
            {
                "name": "body",
                "value": 6
            },
            {
                "name": "mind",
                "value": 6
            },
            {
                "name": "stamina",
                "value": 12
            },
            {
                "name": "aps",
                "value": 2
            },
            {
                "name": "os",
                "value": 2
            }
        ],
        "powers": [
            {
                "name": "Plays",
                "key": "Contra-Synchronicity",
                "controls": [
                    {
                        "name": "Plays",
                        "value": false,
                        "key": "Contra-Synchronicity",
                        "controls": [],
                        "active": false
                    }
                ]
            }
        ],
        "ohun": [
            {
                "name": "Chems",
                "key": "_common",
                "controls": [
                    {
                        "name": "Chems",
                        "value": false,
                        "key": "_common",
                        "controls": []
                    }
                ]
            },
            {
                "name": "Cards",
                "key": "Contra-Synchronicity",
                "controls": [
                    {
                        "name": "Cards",
                        "value": false,
                        "key": "Contra-Synchronicity",
                        "controls": []
                    }
                ]
            }
        ],
        "stunts": [
            {
                "name": "Sniper Shot",
                "value": "Sniper Shot",
                "key": false,
                "description": "Uses 2 AP, but does double damage. Only applies to organic enemies. Can only be used with Medium Ranged Weapons. Cannot be used with burst or full-auto fire.",
                "id": "Sniper Shot",
                "controls": [
                    {
                        "name": "Sniper Shot",
                        "value": false,
                        "key": false,
                        "controls": []
                    }
                ]
            },
            {
                "name": "Stunt",
                "value": false,
                "key": false,
                "controls": []
            }
        ],
        "gear": [
            {
                "value": "false|gear|NaN|"
            }
        ],
        "description": [
            {
                "name": "handle",
                "value": ""
            },
            {
                "name": "ekip",
                "value": ""
            },
            {
                "name": "background",
                "value": "You used to work as an assassin in a black ops team, but slipped your leash. You hope they haven't tracked you down yet."
            }
        ]
    }
});