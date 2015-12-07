define({
    "name": "Military Neural Interface",
    "description": "You have been implanted with a NATO or Almaz-Norinco standard military neural interface by a former employer. You retain the interface and the possibility to implant further military-grade wetware.",
    "link": "#MilitaryNeuralInterface",
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
            "link" : "#OhunDrones",
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
            "link" : "#PowersMilGradeWetware",
            "list": [
                {
                    "name": "Low-light Vision",
                    "type" : "passive",
                    "description" : "User sees normally in near-darkness.",
                    "list": []
                },
                {
                    "name": "Datalink",
                    "type" : "passive",
                    "description" : "User can get a configurable information feed directly into the MNI. This can be used for any purpose a conventional communication device.",
                    "list": []
                },
                {
                    "name": "Implanted Light Weapon",
                    "description": "The user has a concealed implanted light weapon. Flechette guns, tasers, and poison darts are common. Damage is ${2+level}.",
                    "list": [{
                        "name": "Improved Implanted Light Weapon",
                        "description": "The user has a concealed implanted light weapon. Flechette guns, tasers, and poison darts are common. Damage is ${2+level}.",
                        "list": [{
                            "name": "Advanced Implanted Light Weapon",
                            "description": "The user has a concealed implanted light weapon. Flechette guns, tasers, and poison darts are common. Damage is ${2+level}.",
                            "list": [{
                                "name": "Darktech Implanted Light Weapon",
                                "description": "The user has a concealed implanted light weapon. Flechette guns, tasers, and poison darts are common. Damage is ${2+level}.",
                                "list": []
                            }]
                        }]
                    }]
                },
                {
                    "name": "Sub-Dermal Armour",
                    "description" : "The user has an implanted sub-dermal smartmatter armour mesh. When energised, it provides an additional point of protection, which stacks with worn armour. The effect lasts one round.",
                    "list": [{
                        "name": "Improved Sub-Dermal Armour",
                        "description" : "The user has an implanted sub-dermal smartmatter armour mesh. When energised, it provides additional protection for ${1+level}, which stacks with worn armour. The effect lasts ${1+level} rounds.",
                        "list": [{
                            "name": "Advanced Sub-Dermal Armour",
                            "description" : "The user has an implanted sub-dermal smartmatter armour mesh. When energised, it provides additional protection for ${1+level}, which stacks with worn armour. The effect lasts ${1+level} rounds.",
                            "list": [{
                                "name": "Darktech Sub-Dermal Armour",
                                "description" : "The user has an implanted sub-dermal smartmatter armour mesh. When energised, it provides additional protection for ${1+level}, which stacks with worn armour. The effect lasts ${1+level} rounds.",
                                "list": []
                            }]
                        }]
                    }]
                },
                {
                    "name": "Enhanced Strength",
                    "description" : "Tasks requiring feats of strength are one level easier. The effect lasts one round.",
                    "list": [{
                        "name": "Superior Enhanced Strength",
                        "description" : "Tasks requiring feats of strength are ${1+level} levels easier. The effect lasts ${1+level} rounds.",
                        "list": [{
                            "name": "Advanced Enhanced Strength",
                            "description" : "Tasks requiring feats of strength are ${1+level} levels easier. The effect lasts ${1+level} rounds.",
                            "list": [{
                                "name": "Darktech Enhanced Strength",
                                "description" : "Tasks requiring feats of strength are ${1+level} levels easier. The effect lasts ${1+level} rounds.",
                                "list": []
                            }]
                        }]
                    }]
                },
                {
                    "name": "Enhanced Speed",
                    "description" : "Tasks requiring feats of speed are one level easier. The effect lasts one round.",
                    "list": [{
                        "name": "Superior Enhanced Speed",
                        "description" : "Tasks requiring feats of speed are ${1+level} levels easier. The effect lasts ${1+level} rounds.",
                        "list": [{
                            "name": "Advanced Enhanced Speed",
                            "description" : "Tasks requiring feats of speed are ${1+level} levels easier. The effect lasts ${1+level} rounds.",
                            "list": [{
                                "name": "Darktech Enhanced Speed",
                                "description" : "Tasks requiring feats of speed are ${1+level} levels easier. The effect lasts ${1+level} rounds.",
                                "list": []
                            }]
                        }]
                    }]
                },
                {
                    "name": "Enhanced Focus",
                    "description" : "Tasks requiring intense concentration are one level easier. This includes aimed attacks. The effect lasts one round.",
                    "list": [{
                        "name": "Superior Enhanced Focus",
                        "description" : "Tasks requiring intense concentration are ${1+level} levels easier. This includes aimed attacks. The effect lasts ${1+level} rounds.",
                        "list": [{
                            "name": "Advanced Enhanced Focus",
                            "description" : "Tasks requiring intense concentration are ${1+level} levels easier. This includes aimed attacks. The effect lasts ${1+level} rounds.",
                            "list": [{
                                "name": "Darktech Enhanced Focus",
                                "description" : "Tasks requiring intense concentration are ${1+level} levels easier. This includes aimed attacks. The effect lasts ${1+level} rounds.",
                                "list": []
                            }]
                        }]
                    }]
                },
                {
                    "name": "Neural Block",
                    "type" : "passive",
                    "description": "Wounded characters function as normal. Incapacitated characters function as Wounded.",
                    "list": []
                }
            ]
        }
    ]
});