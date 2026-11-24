const questions = [
    {
        question: "What's your ideal day out?",
        answers: [
            {
                text: "Exploring the city with no plan. Just go with the flow!",
                type: "Crossbody"
            },
            {
                text: "Going somewhere fancy for lunch.",
                type: "Handbag"
            },
            {
                text: "Running errands and bringing everything I might need.",
                type: "Tote Bag"
            },
            {
                text: "Staying home, ordering food, and enjoying my leisure.",
                type: "Backpack"
            }
        ]
    },

    {
        question: "What matters most when choosing a bag?",
        answers: [
            {
                text: "It should be practical and organized.",
                type: "Satchel"
            },
            {
                text: "The cherry on top for my outfit.",
                type: "Shoulder Bag"
            },
            {
                text: "It should be small enough that I barely notice it.",
                type: "Mini Bag"
            },
            {
                text: "Whatever.",
                type: "Tote Bag"
            }
        ]
    },

    {
        question: "Pick an outfit.",
        answers: [
            {
                text: "A polished, elegant look.",
                type: "Handbag"
            },
            {
                text: "Something trendy and eye-catching.",
                type: "Mini Bag"
            },
            {
                text: "Just throw anything comfy.",
                type: "Backpack"
            },
            {
                text: "A simple outfit with a stylish accessory.",
                type: "Shoulder Bag"
            }
        ]
    },

    {
        question: "You're going on vacation. What are you bringing?",
        answers: [
            {
                text: "Just the essentials.",
                type: "Crossbody"
            },
            {
                text: "A bag that can survive the entire day.",
                type: "Tote Bag"
            },
            {
                text: "Something that has many compartments that keeps everything organized.",
                type: "Satchel"
            },
            {
                text: "The ideal vacation is at home.",
                type: "Mini Bag"
            }
        ]
    },

    {
        question: "What's your shopping style?",
        answers: [
            {
                text: "I compare everything before deciding.",
                type: "Satchel"
            },
            {
                text: "If I love it, I want it immediately.",
                type: "Mini Bag"
            },
            {
                text: "I look for something timeless.",
                type: "Handbag"
            },
            {
                text: "I only go shopping when I actually need something.",
                type: "Backpack"
            }
        ]
    },

    {
        question: "Your friends are planning a spontaneous trip. You...",
        answers: [
            {
                text: "Immediately start planning what to bring.",
                type: "Backpack"
            },
            {
                text: "Grab my essentials and go.",
                type: "Crossbody"
            },
            {
                text: "Make sure I have a bag big enough for everyone else's stuff too.",
                type: "Tote Bag"
            },
            {
                text: "Ask, \"Can we just do something at someone's house?\"",
                type: "Shoulder Bag"
            }
        ]
    },

    {
        question: "Pick a place to spend your afternoon.",
        answers: [
            {
                text: "A cute café.",
                type: "Shoulder Bag"
            },
            {
                text: "A museum or gallery.",
                type: "Handbag"
            },
            {
                text: "Exploring shops around the city.",
                type: "Crossbody"
            },
            {
                text: "My bedroom with snacks, Wi-Fi, and absolutely no plans.",
                type: "Backpack"
            }
        ]
    },

    {
        question: "What's your biggest bag-related problem?",
        answers: [
            {
                text: "I somehow carry my entire life around.",
                type: "Tote Bag"
            },
            {
                text: "I can never find anything inside.",
                type: "Satchel"
            },
            {
                text: "I want something practical but still stylish.",
                type: "Shoulder Bag"
            },
            {
                text: "I barely bring anything because I don't want to carry it.",
                type: "Mini Bag"
            }
        ]
    },

    {
        question: "You found a huge sum of money in front of your door. What would you do?",
        answers: [
            {
                text: "Make sure it gets returned to its rightful owner.",
                type: "Satchel"
            },
            {
                text: "Try to figure out where it came from first.",
                type: "Crossbody"
            },
            {
                text: "Immediately start thinking about what I could buy with it.",
                type: "Mini Bag"
            },
            {
                text: "Honestly... I'd be too shocked to do anything at first.",
                type: "Handbag"
            }
        ]
    },

    {
        question: "Pick your ideal go-to bag to bring on vacation.",
        answers: [
            {
                text: "Something small and easy to carry around.",
                type: "Crossbody"
            },
            {
                text: "Something spacious enough to hold everything I might need.",
                type: "Tote Bag"
            },
            {
                text: "Something hands-free and comfortable for exploring.",
                type: "Backpack"
            },
            {
                text: "Something stylish and structured for my outfits.",
                type: "Handbag"
            }
        ]
    },

    {
        question: "How do you deal with compliments on your look?",
        answers: [
            {
                text: "\"Thank you!\" — I'll happily take the compliment.",
                type: "Handbag"
            },
            {
                text: "\"Really? You think so?\" — I get a little shy!!!",
                type: "Shoulder Bag"
            },
            {
                text: "\"I know, right?\" — I'll probably compliment myself too.",
                type: "Mini Bag"
            },
            {
                text: "\"Oh, this? I just threw it on.\"",
                type: "Backpack"
            }
        ]
    },

    {
        question: "It's your birthday! What's the first thing you have in mind?",
        answers: [
            {
                text: "\"Where am I celebrating?\"",
                type: "Handbag"
            },
            {
                text: "\"What am I wearing?\"",
                type: "Shoulder Bag"
            },
            {
                text: "\"Who am I inviting?\"",
                type: "Tote Bag"
            },
            {
                text: "\"I wonder what I am getting...\"",
                type: "Mini Bag"
            }
        ]
    }
];


const resultDescriptions = {

    "Crossbody": {
        intro: "A Crossbody! I knew you were the spontaneous type.",
        description: "As a crossbody type, you like keeping things simple, practical, and easy. You’re always ready to go wherever the day takes you, regardless of whether you have a plan or not. You tend to go with the flow, and you don't need to carry your entire life around inside your bag. Maybe just the essentials, with enough room to carry whatever your adventure takes you!"
    },

    "Handbag": {
        intro: "A Handbag! Very classy, you are!",
        description: "As a handbag type, people tend to see you as the “well-put” individual. You find appreciation in elegance, sophistication, and timeless style. You know how to put yourself together and enjoy the little details that make something feel polished. You like things that are classic, intentional, and effortlessly refined."
    },

    "Tote Bag": {
        intro: "A Tote Bag?! Yeah, I can already tell you're the one everyone relies on.",
        description: "Have you ever been called the caretaker? As a tote bag type, you like being prepared for anything, not just for yourself, but also for other people! You somehow have room for everything, and you NEED to have room for everything. As people see it, you are very practical, dependable, and generous. You’re the friend who always seems to have exactly what someone needs, and that’s great!"
    },

    "Backpack": {
        intro: "A Backpack! I knew you were the comfy type.",
        description: "As a backpack type, you value comfort, convenience, and doing things at your own pace. You don't need to overthink everything or dress up just because you’re going somewhere, like literally just throw anything and go on your merry way type. You’re perfectly happy keeping things relaxed and bringing along whatever makes your day a little better. Whether you're exploring somewhere new or staying home with snacks and Wi-Fi, you know how to make yourself comfortable."
    },

    "Satchel": {
        intro: "A Satchel! Ohh, we love an organized diva!",
        description: "As a satchel type, you like having a plan and knowing where everything belongs. You probably have a long list of what you’re gonna do in a 2 day vacation—or maybe even just your day alone! You are thoughtful, observant, and probably the type to think things through before making a decision. You like knowing what you’re getting into, and having everything in its proper place makes things a whole lot easier. Structure and order are what best defines you!"
    },

    "Shoulder Bag": {
        intro: "Ooh, a Shoulder Bag! You definitely know how to put a look together.",
        description: "As a shoulder bag type, you have a natural eye for style and know how to make an outfit feel complete. A little accessory there, or a little color there. You LOVE matchy colors when it comes to your style! You care about looking good, but you don't have to try too hard to make it work. You appreciate those little details that make something feel uniquely yours, and you know that sometimes the right accessory can bring everything together."
    },

    "Mini Bag": {
        intro: "A Mini Bag?! Very cutesy!",
        description: "As a mini bag type, you’re confident, expressive, and not afraid to have a little fun. Like Crossbody, you tend to go with the flow. You don’t need anything, you just carry whatever fits in that little bag of yours and let the day decide what your arms will be carrying next! You’d rather carry only what you actually need and let your personality do the talking. You like things that stand out, and when you love something, you’re not afraid to go all in. Why carry more when you can make an impact with less?"
    }

};