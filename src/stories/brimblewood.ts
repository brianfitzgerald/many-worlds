import { StoryState, StoryAction, Story } from "../types/Story";
import { next } from "../actions/Story";

const defaultState = {
    swampBranchChosen: false,
    appleEaten: false,
    wellRested: false
}

const actions: StoryAction[] = [
    {
        prompt: `
Your party leaves the inn and hits the road for another day of walking. Brimblewood is still another couple of weeks away,
but spirits are high and the sun is out today.
`,
        actionFilter: (state) => true,
        options: [{ title: '->' }]
    },
    {
        prompt: `Soon, you reach a fork in the road. One leads into a swamp, and the other goes higher into the mountains. They both
lead to Brimblewood. Which do you choose?
`,
        actionFilter: (state) => state.name !== 'not_sure',
        options: [
            { title: 'Cave', action: { swampBranchChosen: false } },
            { title: 'Swamp', action: { swampBranchChosen: true } }
        ]
    },
    // Swamp
    {
        actionFilter: (state) => state.swampBranchChosen === true,
        prompt: `
The swamp is dank, and reeks of frog piss. Your party follows a creaky wooden bridge across the murk.
Suddenly, a frog-man hops in front of your path!
`,
        options: [
            { title: 'Give him some of your rations', action: { fewerRations: true } },
            { title: 'Attempt to ignore him' }
        ]
    },
    {
        actionFilter: (state) => state.swampBranchChosen === true,
        prompt: `'REEEEE!', the frog-man says. He jumps back into the lake, but not before splashing you one more time.`,
        options: [{ title: '->', action: { wetFromFrogman: true } }]
    },
    {
        actionFilter: () => true,
        prompt: `There is a shiny apple on a tree above you.`,
        options: [
            {
                title: 'eat it',
                action: {
                    appleEaten: true
                }
            },
            {
                title: 'ignore it'
            }
        ]
    },
    {
        prompt: `A low level slime blocks your path. 'Must consume!' it says.`,
        options: [
            {
                title: 'give it some food',
                action: {
                    slimeGivenFood: true
                },
                response: 'The slime recedes.'
            },
            {
                title: 'veer off the path, into the woods'
            }
        ]
    },
    {
        prompt: 'The sun begins to set.',
        options: [
            {
                title: 'Set up camp',
                action: {
                    wellRested: true
                }
            },
            {
                title: 'Walk on through the night'
            }
        ]
    },
    {
        prompt: `Dawn of the second day.`,
        options: [next]
    },
    {
        prompt: ``
    }
]

// section where you join carl and attempt to take down the system
// section where you escape and come upon carl later on
// in between filler section with some trials in a forest

const story: Story = {
    id: '820ebcfa-547e-4809-93c8-ad7008d782a8',
    name: 'Brimblewood',
    actions,
    defaultState
}

export default story