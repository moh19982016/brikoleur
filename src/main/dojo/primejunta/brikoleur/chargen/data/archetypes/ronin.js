define({
    name : "Ronin",
    data : {
        "type" : "template",
        "name": {
            "characterName": ""
        },
        "traits": [
            {
                "name": "Military Neural Interface",
                "value": "Military Neural Interface",
                "key": false,
                "description": "You have been implanted with a NATO or Almaz-Norinco standard military neural interface by a former employer. You retain the interface and the possibility to implant further military-grade wetware.",
                "link": "#doc89",
                "id": "Military Neural Interface",
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
                        "name": "Ranged Combat",
                        "value": false,
                        "key": false,
                        "controls": []
                    }
                ]
            },
            {
                "name": "Close Combat",
                "value": "Close Combat",
                "key": false,
                "description": "Training in Close Combat adds bonuses to attack and defence when up close and personal. Thrown weapons fall under this knack.",
                "type": "combat",
                "closed": true,
                "id": "Close Combat",
                "controls": [
                    {
                        "name": "Close Combat",
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
                "name": "Military Grade Wetware",
                "key": "Military Neural Interface",
                "controls": [
                    {
                        "name": "Military Grade Wetware",
                        "value": false,
                        "key": "Military Neural Interface",
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
                "name": "Drones",
                "key": "Military Neural Interface",
                "controls": [
                    {
                        "name": "Drones",
                        "value": false,
                        "key": "Military Neural Interface",
                        "controls": []
                    }
                ]
            }
        ],
        "stunts": [],
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
                "value": ""
            }
        ]
    }
});