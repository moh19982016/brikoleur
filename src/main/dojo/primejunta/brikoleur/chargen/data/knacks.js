define( {
    name: "Knack",
    cost: 4,
    list: [
        {
            name: "Ranged Combat",
            description: "Training in Ranged Combat reduces difficulty of attack with ranged weapons. Ranged Defense is a dedicated skill.",
            type: "combat",
            closed: true,
            list: [
                {
                    name: "Light Ranged Weapons",
                    description: "Covers one-handed, pistol-type ranged weapons, including hand crossbows, and submachine guns.",
                    list: [
                        { name: "Pistol" },
                        { name: "Submachine Gun" },
                        { name: "Hand Crossbow" },
                        { name: "Taser" }
                    ]
                },
                {
                    name: "Medium Ranged Weapons",
                    description: "Covers two-handed, rifle-type ranged weapons, including crossbows, but not including heavy weapons such as RPG's, heavy machine guns, or heavy sniper rifles.",
                    list: [
                        { name: "Assault Rifle" },
                        { name: "Hunting Rifle" },
                        { name: "Sniper Rifle" },
                        { name: "Laser Rifle" },
                        { name: "Light Machine Gun" }
                    ]
                },
                {
                    name: "Heavy Ranged Weapons",
                    description: "Covers heavy infantry weapons, such as RPG's, shoulder-launched missiles, heavy machine guns, heavy sniper rifles, and field mortars.",
                    list: [
                        { name: "Rocket-propelled grenade" },
                        { name: "Field Artillery" },
                        { name: "Shoulder-launched SAM" },
                        { name: "Field Mortar" },
                        { name: "Grenade Launcher" },
                        { name: "Heavy Sniper Rifle" },
                        { name: "Heavy Machine Gun" }
                    ]
                },
                {
                    name: "Ranged Defence",
                    description: "Reduces difficulty of defending against ranged attacks.",
                    closed: true,
                    list: [
                        {
                            name: "Ranged Defence (Urban Terrain)"
                        },
                        {
                            name: "Ranged Defence (Natural Terrain)"
                        }
                    ]
                }
            ]
        },
        {
            name: "Close Combat",
            description: "Training in Close Combat reduces difficulty of attack and defence when up close and personal. Thrown weapons fall under this knack.",
            type: "combat",
            closed: true,
            list: [
                {
                    name: "Unarmed Combat",
                    list: [
                        {
                            name: "Boxing"
                        },
                        {
                            name: "Ju-jutsu"
                        }
                    ]
                },
                {
                    name: "Melee Weapons",
                    list: [
                        { name: "Knifefighting" },
                        { name: "Historical European Martial Arts" }
                    ]
                },
                {
                    name: "Thrown Weapons",
                    description: "Covers all types of thrown weapons plus bows, but not crossbows.",
                    list: [
                        { name: "Bow" },
                        { name: "Sling" },
                        { name: "Boomerang" },
                        { name: "Hand grenade" }
                    ]
                }
            ]
        },
        {
            name: "Subterfuge",
            description: "Covers stealth, deception, subterfuge, and other similarly underhanded approaches to solving problems. Sometimes overlaps with knack for People.",
            list: [
                {
                    name: "Lie",
                    list: [ { name : "Social Engineering" } ]
                },
                {
                    name: "Disguise",
                    list: [
                        { name : "Impersonation" } ]
                },
                {
                    name: "Hide",
                    list: [
                        { name : "Active Camouflage Armour" } ]
                },
                {
                    name: "Ambush",
                    list: [
                        { name : "Lay Traps" } ]
                }
            ]
        },
        {
            name: "Technology",
            description: "The character has a knack for getting technological things to do what she wants.",
            list: [
                {
                    name: "Mechanics",
                    list: [ { name : "Weapon Crafting" },
                        { name : "Trapmaking" },
                        { name : "Drone Crafting" } ]
                },
                {
                    name: "Computer Use",
                    list: [
                        { name : "Intrusion" },
                        { name : "Data Retrieval and Analysis" },
                        { name : "Programming" } ]
                },
                {
                    name: "Drone Control",
                    list: [
                        { name : "Micro-Drones" },
                        { name : "Fixed-Wing" },
                        { name : "Gunships" },
                        { name : "Powered Armour" } ]
                }
            ]
        },
        {
            name: "Q-Space",
            description: "You have an unusual affinity for Q-Space, and all the happens in it.",
            link: "#doc75",
            list: [
                {
                    name: "Q-Space Navigation",
                    list: [ { name : "Nearspace" },
                        { name : "Wildspace" },
                        { name : "Farspace" },
                        { name : "Palès" } ]
                },
                {
                    name: "Q-Space Crafting",
                    list: [ { name : "Craft Esprí" },
                        { name : "Craft Environment" },
                        { name : "Craft Fwé" } ]
                },
                {
                    name: "Intrusion",
                    list: [
                        { name : "Break Security" },
                        { name : "Non-detection" } ]
                },
                {
                    name: "Q-Space Combat",
                    list: [
                        { name : "Combat Against Brikoleurs" },
                        { name : "Combat Against Esprís" } ]
                }
            ]
        },
        {
            name: "People",
            description: "You grok what makes people tick, and can turn it to your advantage.",
            list: [
                {
                    name: "Power Relations",
                    list: [ { name : "Corporate" },
                        { name : "Politics" },
                        { name : "Governmental" },
                        { name : "Streetwise" },
                        { name : "Police" },
                        { name : "Socialite" } ]
                },
                {
                    name: "Deception",
                    list: [
                        { name : "Confidence Trickster" },
                        { name : "Fast Talk" } ]
                },
                {
                    name: "Persuasion",
                    list: [
                        { name : "Debate" },
                        { name : "Seduction" },
                        { name : "Intimidation" } ]
                }
            ]
        },
        {
            name: "Spiritual Practice",
            description: "You have a feel for the numinous, whether it has to do with the lwa of Q-Space, the teachings of the Buddha, or the hikmat behind the laws of Islam.",
            list: [
                {
                    name: "Santería",
                    list: [ { name : "Ghede Lwa" },
                        { name : "Rada Lwa" } ]
                },
                {
                    name: "Islam",
                    list: [
                        { name : "Islamic Law" },
                        { name : "Mysticism" } ]
                }
            ]
        },
        {
            name: "Knowledge",
            description: "You're good with facts, and understanding what they mean.",
            list: [
                {
                    name: "Biomedicine",
                    list: [ { name : "Immunology" } ]
                },
                {
                    name: "Chemistry",
                    list: [
                        { name : "Materials Science" },
                        { name : "Pharmaceutical Synthesis" },
                        { name : "Explosives" } ]
                },
                {
                    name: "History",
                    list: [
                        { name : "Pre-Columbian Mesoamerica" } ]
                },
                {
                    name: "Linguistics",
                    list: [
                        { name : "Classical Latin" } ]
                },
                {
                    name: "Political Science",
                    list: [
                        { name : "Anarcho-Trotskyite Theory" } ]
                }
            ]
        },
        {
            name: "Athletics",
            description: "You're physically talented: naturally faster, stronger, and better coordinated than most people.",
            list: [
                {
                    name: "Running",
                    list: [ { name : "Parkour" },
                        { name : "Sprinting" },
                        { name : "Endurance Running" } ]
                },
                {
                    name: "Swimming",
                    list: [
                        { name : "Sprint Swimming" },
                        { name : "Endurance Swimming" } ]
                },
                {
                    name: "Jumping",
                    list: [
                        { name : "High Jump" },
                        { name : "Long Jump" } ]
                },
                {
                    name: "Throwing (overlaps with Combat Skill: Thrown Weapons)",
                    list: [
                        { name : "Javelin" },
                        { name : "Hand Grenade" } ]
                },
                {
                    name: "Climbing",
                    list: [
                        { name : "Mountaineering" },
                        { name : "Free Climbing" } ]
                }
            ]
        }
    ]
});