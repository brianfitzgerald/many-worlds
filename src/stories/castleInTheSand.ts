import { StoryState, StoryAction, Story } from "../types/Story";
import { next } from "../actions/Story";

const defaultState = {}

const actions: StoryAction[] = [
    {
        prompt: `
With the plunge of your sword, the Lich King sinks to the ground. As he collapses, he unbuckles an amulet from his torso, and says:
'Bah! So annoying, to be bested once again! No matter, there will be more kingdoms to conquer, in another time...'
The amulet bursts open, and a blue light escapes from within. It swirls into a portal, and the Lich King jumps into it, seemingly vanishing.
`,
        actionFilter: (state) => true,
        options: [
            {
                title: 'Jump into the portal',
            },
            {
                title: 'Run away',
                response: 'Try as you might, the portal drags you in...'
            }
        ]
    },
    {
        prompt: `
After a flurry of blue light, your group emerges on top of a mountain.
In the distance, you spot the spires of a city behind a massive wall.
Atop a nearby hillside, there is a small shrine.
Your group is exhausted from the fight with the Lich King, and so you decide to make camp.
`,
        options: [next]
    },
    {
        prompt: `
As your group is about to hit the hay, you hear some rustling in the bushes. Your group unsheathes their weapons,
and splits the bush...
`,
        options: [next]
    },
    {
        prompt: `
...Revealing a small child, in a burlap sack! He's clutching a pile of the loot you took from the Lich King.
"Please, I need this to pay for food tonight!" he squeals.
`,
        options: [
            {
                title: 'Take back your gear, and scold the boy',
                action: { lootGivenToBoy: 'none' }
            },
            {
                title: 'Give the boy a few shillings to pay for food',
                action: { lootGivenToBoy: 'some' }
            },
            {
                title: 'Give the boy all your loot',
                action: { lootGivenToBoy: 'lots' }
            }
        ]
    },
    {
        prompt: `
The next day, you are all ready to go, but cannot decide where to.
You could try to enter the walled city on the horizon...
Or you could search for a place to stash your loot...
Or you could head to the shrine, and ask for a blessing.
`,
        options: [
            {
                title: 'Enter the walled city on the horizon'
            },
            {
                title: 'Search for a place to stash your loot'
            },
            {
                title: 'Head to the shrine, and ask for a blessing'
            }
        ]
    },
    {
        prompt: `
Your group departs, carefully following the cliffside down the mountain.
But not before long, you hear the mountain rumble, and the cliff you're on collapses!
You're plunging to your doom....
`
    },
    {
        prompt: `
But miraculously, a portal opens up beneath you! It's the one from the Lich King's chambers...
`,
        options: [
            {
                title: 'Fall in'
            }
        ]
    },
    {
        prompt: `
You emerge from the portal bruised and confused. You're in the middle of an empty field.
The grass beneath your feet is yellow, and the air smells of soot.
In the distance, you see that the walled kingdom is far larger, and a black soot is being released from it.
The shrine has been replaced with a power terminal.
`,
        options: [
            {
                title: 'Examine the terminal',
                action: { examineTerminal: true }
            },
            {
                title: 'Head to the city'
            }
        ]
    },
    {
        prompt: `
On the base of the terminal is located a plaque, which reads:
'JOB COMPL 4 64 1203 : TERM 1093 : KW 364 : JPY 932'
`,
        actionFilter: (state) => state.examineTerminal === true
    },
    {
        prompt: `
You reach the city wall. There is a terminal set into it, with a number of options listed on the screen:`,
        options: [
            {
                title: 'LEGEND OF THE CITY'
            },
            {
                title: 'HISTORY OF THE CITY'
            }
        ]
    },
    {
        actionFilter: (state) => state.lootGivenToBoy !== 'none',
        prompt: `
The City was founded a hundred years ago, when the First Leader used his spoils from defeating the Lich King to purchase
several hundred turnips. Through his shrewd business skills, he was able to turn this into several thousand turnips,
and eventually, he amassed more wealth than anyone in the Kingdom.
`,
        options: [next]
    }
]

// section where you join carl and attempt to take down the system
// section where you escape and come upon carl later on
// in between filler section with some trials in a forest

const story: Story = {
    id: '1b0dc9d6-9480-4afd-bda4-eb18167b3ef2',
    name: 'Castle in the Sand',
    actions,
    defaultState
}

export default story