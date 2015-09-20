define({
    list : [
    {
        name: "Suppressive Fire",
        link: "Ranged Combat",
        description: "Targets enemy who is behind cover. A successful attack causes the target to lose 1 AP for the next round. A critical success causes loss of all AP’s for the next round.",
        evolve: [{
            name: "Improved Suppressive Fire",
            description: "As Suppressive Fire, but every 2 Body points spent extends AP loss by 1 round.",
            evolve: [{
                name: "Expert Suppressive Fire",
                description: "As Suppressive Fire, but a successful attack also does half damage.",
                evolve: [{
                    name: "Master Suppressive Fire",
                    description: "As Expert Suppressive Fire, but a successful attack causes loss of 2 AP and full damage."
                }]
            }]
        }]
    },
    {
        name: "Headshot",
        link: "Ranged Combat",
        description: "Uses 2 AP, but does double damage. Only applies to organic enemies. Cannot be used with burst or full-auto fire.",
        evolve: [{
            name: "Improved Headshot",
            description: "As Headshot, but only uses 1 AP.",
            evolve: [{
                name: "Expert Headshot",
                description: "As Headshot, but causes an additional 2 points of damage per Mind point spent.",
                evolve: [{
                    name: "Master Headshot",
                    description: "As Expert Headshot, but ignores Armour."
                }]
            }]
        }]
    },
    {
        name: "Watch",
        link: "Ranged Combat",
        description: "Instead of attacking, the player watches an enemy combatant who is behind cover. When the enemy emerges to move or fire, the player gets an attack with a difficulty lowered by 1 level.",
        evolve: [{
            name: "Improved Watch",
            description: "As Watch, with spent Body points added to damage, and a critical hit also prevents the enemy from moving or firing. The Body points are spent when announcing the use of the Power.",
            evolve: [{
                name: "Expert Watch",
                description: "As Improved Watch, but a normal hit prevents the enemy from moving or firing.",
                evolve: [{
                    name: "Master Watch",
                    description: ": As Expert Watch, but lowers the difficulty of the riposte attack by two levels."
                }]
            }]
        }]
    }]
});