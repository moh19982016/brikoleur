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
                "description": "Guns pointed at you will misfire. You can manipulate probabilities. You can create and use Cards to produce persistent effects distorting probabilities. You can acquire special abilities that produce specific and powerful CS effects.",
                "link": "#doc88",
                "id": "Contra-Synchronicity",
                "controls": []
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
                "description": "Training in Ranged Combat adds bonuses to attack with ranged weapons. Ranged Defense is a dedicated skill.",
                "type": "combat",
                "closed": true,
                "id": "Ranged Combat",
                "controls": [
                    {
                        "name": "Light Ranged Weapons",
                        "value": "Light Ranged Weapons",
                        "key": false,
                        "controls": [
                            {
                                "name": "Light Ranged Weapons",
                                "value": false,
                                "key": false,
                                "controls": []
                            }
                        ],
                        "description": "Covers one-handed, pistol-type ranged weapons, including hand crossbows, and submachine guns.",
                        "id": "Light Ranged Weapons"
                    },
                    {
                        "name": "Ranged Combat",
                        "value": false,
                        "key": false,
                        "controls": []
                    }
                ]
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
                "value": "You have worked in corporate black ops, but have slipped your leash."
            }
        ]
    }
});