/**
 * Traits. Apart from the standard fields (name, description, list), traits have the following properties:
 *
 * ohun
 * powers
 * features
 */
define({
    name : "Trait",
    closed: true,
    list : [
        {
            name : "Akoto Interface",
            powers : [{
                name : "Zoutis",
                list : [{
                    name : "Blast",
                    mind : 1,
                    description : "Area attack with the zam’s base damage on an Immediate area. Standard difficulty.",
                    list : [{
                        name : "Improved Blast",
                        mind : 4,
                        description : "Area attack on a Small area, with Mind cost added to zam’s damage. Difficulty of attack lowered by 1.",
                        list : [{
                            name : "Expert Blast",
                            mind : 8,
                            description : "Area attack on a Medium area which ignores friendly targets, with Mind cost added to zam’s damage. Difficulty of attack lowered by 2.",
                            list : [{
                                name : "Master Blast",
                                mind : 12,
                                description : "Area attack on a Large area which ignores friendly targets, with Mind cost added to zam’s damage. Difficulty of attack lowered by 3."
                            }]
                        }]
                    }]
                }]
            }],
            ohun : [
                {
                    name : "Fwés",
                    description : "Fwés are purpose-built artefacts deployed in Q-Space. They are consumed when used.",
                    list : [{
                        "name" : "Armour",
                        "level" : "$NUMBER",
                        "description" : "Increases the user's armour by ${calc(4 * this.level)} for ${calc( 2 * level)} rounds."
                    },
                    {
                        "name" : "Damage",
                        "level" : "$NUMBER",
                        "description" : "Increases the user's zam damage by ${calc(4 * this.level)} for ${calc( 2 * level )} rounds."
                    }]
                },
                {
                    name : "Esprís",
                    type : "persistent",
                    description : "Esprís are autonomous Q-Space constructs with a variety of capabilities. They are reusable unless destroyed. Each esprí takes up an ohun slot, whether active or not.",
                    list : []
                }
            ],
            features : [{
                name : "Oga",
                description : "Ogas are skill packages slotted into the Akoto interface. It takes 24 hours for an oga to integrate, but can be removed at any time. The user cannot jack into Q-Space when one is slotted.",
                list : []
            }]
        },
        {
            name : "Lwa's Horse",
            description: "A Lwa's Horse is crowned with a lwa. He serves it, and in turn may petition it for favours. Lwa's Horses are respected by their friends and feared by their enemies.",
            ohun : [
                {
                    name : "Vévés",
                    min_level : 0,
                    type : "ad-hoc",
                    verb : "inscribe",
                    description : "While preparation such as intel can help make them, vévés are drawn in the field. The santero invokes his lwa by drawing a vévé on a suitable surface. They are drawn on the spot. It takes a minimum of 1 round to draw one. Vévés which cost no juju may can be drawn without limitations.",
                    list : []
                },
                {
                    name : "Zombies",
                    type : "persistent",
                    description : "Santeros can turn humans or other organics into zombies by connecting a Q-tech Scroll prepared for them by their lwa to their Akoto or Military Neural interface. Each golem accompanying the santero uses one ohun slot.",
                    list : []
                },
                {
                    name : "Golems",
                    type : "persistent",
                    description : "Santeros can turn drones into golems by connecting a Q-tech Scroll prepared for them by their lwa to their control module. Each golem accompanying the santero uses one ohun slot.",
                    list : []
                }
            ]
        }
    ]
});
