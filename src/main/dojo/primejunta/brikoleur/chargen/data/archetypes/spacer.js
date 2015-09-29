define({
    name : "Spacer",
    data : {
        "name": {
            "characterName": ""
        },
        "traits": [
            {
                "name": "Genetically Engineered - Spacer",
                "value": "Genetically Engineered - Spacer",
                "key": false,
                "description": "Spacers are humans who have undergone modification to cope better with low-gravity, high-radiation outer space habitats.",
                "link": "#doc130",
                "id": "Genetically Engineered - Spacer",
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
                "name": "Knack",
                "value": false,
                "key": false,
                "controls": []
            },
            {
                "key": "Zero-Gee activities",
                "value": "Zero-Gee activities",
                "controls": [
                    {
                        "name": "",
                        "value": false,
                        "key": "Zero-Gee activities",
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