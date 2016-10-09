define({
    "name": "Santero",
    "description": "A Santero is crowned with a lwa. He serves it, and in turn may petition it for favours." +
                   " Santeros are respected by their friends and feared by their enemies.",
    "link" : "#LwasHorse",
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
            "description": "Vévés are drawn on the spot. Santeros invoke their lwa with them.",
            "link" : "#OhunVvsandScrolls"
        },
        {
            "name": "Zombies",
            "type": "persistent",
            "description": "Santeros can turn humans and animals into zombies by use of Q-tech scrolls.",
            "link" : "#ScrollsZombiesandGolems",
            "list": []
        },
        {
            "name": "Golems",
            "type": "persistent",
            "description": "Santeros can turn drones into golems by use of Q-tech scrolls.",
            "link" : "#ScrollsZombiesandGolems",
            "list": []
        },
        {
            "name": "Esprís",
            "type": "persistent",
            "description": "Esprís are autonomous Q-Space constructs. They are reusable unless destroyed.",
            "list": []
        }
    ]
});