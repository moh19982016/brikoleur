define({
    name: "Grunt",
    data: {
        "name": {
            "characterName": ""
        },
        "traits": [
            {
                "name": "Military Neural Interface",
                "value": "Military Neural Interface",
                "key": false,
                "controls": [],
                "description": "You have been implanted with a NATO or Almaz-Norinco standard military neural interface by a former employer. You retain the interface and the possibility to implant further military-grade wetware.",
                "link": "#doc89",
                "id": "Military Neural Interface"
            },
            {
                "name": "Genetically Engineered - Jagun",
                "value": "Genetically Engineered - Jagun",
                "key": false,
                "description": "Jagun are genetically enhanced super-warriors. They are faster, stronger, and tougher than baseline humans.",
                "link": "#doc132",
                "id": "Genetically Engineered - Jagun",
                "controls": []
            }
        ],
        "knacks": [
            {
                "name": "Knack",
                "value": false,
                "key": false,
                "controls": []
            },
            {
                "key": "Close Combat",
                "value": "Close Combat",
                "controls": [
                    {
                        "name": "Unarmed Combat",
                        "value": "Unarmed Combat",
                        "key": "Close Combat",
                        "id": "Unarmed Combat",
                        "controls": [
                            {
                                "name": "Unarmed Combat",
                                "value": false,
                                "key": "Close Combat",
                                "controls": []
                            }
                        ]
                    },
                    {
                        "name": "Close Combat",
                        "value": false,
                        "key": "Close Combat",
                        "controls": []
                    }
                ]
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
        "stunts": [
            {
                "name": "Burst of Strength",
                "value": "Burst of Strength",
                "key": false,
                "description": "Any combat actions involving strength are 1 level easier.",
                "id": "Burst of Strength",
                "controls": [
                    {
                        "name": "Burst of Strength",
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
                "value": ""
            }
        ]
    }
});