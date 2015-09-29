define({
    "name": "Chems",
    "description": "Any character may use chems. They can enhance performance in a variety of ways. Many ekips are drugged to the gills a lot of the time.",
    "link" : "#doc45",
    "list": [
        {
            "name": "Stabilise",
            "level": "$NUMBER",
            "description": "An Incapacitated character is stabilised and stops losing Body points. Adds ${0+level} temporary Body points. Once the chem wears off, these Body points are lost, which may kill the character. May be administered in combat. Duration: 1 hour."
        },
        {
            "name": "Neural Block",
            "level": "$NUMBER",
            "description": "A Wounded character functions normally. An Incapacitated character functions as Wounded. Does not stop the condition of an Incapacitated character deteriorating. Adds ${0+level} temporary Mind points. Once the chem wears off, these Mind points are lots, which may kill the character. May be administered in combat. Duration: 1 hour.."
        },
        {
            "name": "Focus",
            "level": "$NUMBER",
            "description": "The character may ignore ${1+level} levels of circumstantial penalties to actions for the duration of the effect. When the effect ends, the character suffers a backlash of ${1+level} Mind point, which may Wound, Incapacitate, or even kill him. Duration: 1 hour.."
        },
        {
            "name": "Neural Stim",
            "level": "$NUMBER",
            "description": "Any tasks involving Strength or Speed are ${1+level} levels easier while the chem is in effect. When the effect ends, the character suffers a backlash of ${1+level} Body points, which may Wound, Incapacitate, or even kill him. Duration: 1 hour."
        }
    ]
});