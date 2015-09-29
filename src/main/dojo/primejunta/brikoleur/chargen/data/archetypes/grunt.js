define({
    name : "Grunt",
    data : {
        "name": {
            "characterName": ""
        },
        "traits": [
            {
                "name": "Genetically Engineered - Jagun",
                "value": "Genetically Engineered - Jagun",
                "key": false,
                "description": "Jagun are genetically enhanced super-warriors. They are faster, stronger, and tougher than baseline humans.",
                "link": "#doc132",
                "id": "Genetically Engineered - Jagun",
                "controls": []
            },
            {
                "name": "Military Neural Interface",
                "value": "Military Neural Interface",
                "key": false,
                "description": "You have been implanted with a NATO or Almaz-Norinco standard military neural interface by a former employer. You retain the interface and the possibility to implant further military-grade wetware.",
                "link": "#doc89",
                "id": "Military Neural Interface",
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
                "key": "Close Combat",
                "value": "Close Combat",
                "controls": [
                    {
                        "name": "Close Combat",
                        "value": false,
                        "key": "Close Combat",
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
        "powers": [],
        "ohun": [],
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