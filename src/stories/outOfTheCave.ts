import { StoryState, StoryAction, Story } from "../types/Story";

const defaultState = {
    name: '',
    wouldSteal: false,
    joinedCarl: false
}

const actions: StoryAction[] = [
    {
        prompt:`
You awake in a prison cell. The walls around you are some sort of bedrock, mottled with some sort of fungus, or a mucus, you can't tell.
The room pulses, but you figure that must be due to dehydration. You have no idea how long you've been in here.
Come to think of it, what was your name again?
`,
        filter: () => true,
        options: [
            {
                title: 'Dave',
                action: {
                    name: 'Dave'
                }    
            },
            {
                title: 'Carl',
                action: {
                    name: 'Carl'
                }    
            },
            {
                title: `I'm not sure`,
                action: {
                    name: 'not_sure'
                }    
            },
        ]
    },
    {
        prompt: `That might be problematic, but for now, let's keep going.`,
        filter: (state: StoryState) => state.name === 'not_sure',
        options: [{ title: '->' }]
    },
    {
        prompt: `Not the prettiest name in the world, but I suppose one doesn't have much say in the matter.`,
        filter: (state: StoryState) => state.name !== 'not_sure',
        options: [{ title: '->' }]
    },
    {
        prompt: `
Slumped against the wall of your cell, you wonder about how you might have wound up here.
Did you commit a crime? Maybe you got caught stealing something...
`,
        filter: () => true,
        options: [
            {
                title: `It was bound to happen eventually.`,
                action: {
                    wouldSteal: true
                }    
            },
            {
                title: `No, I'd never steal!`
            },
        ]
    },
    {
        prompt: `Suddenly, you hear thuds from the other side of the wall. Like someone is smashing it down with a hammer.`,
        filter: (state: StoryState) => true,
        options: [
            {
                title: `Run to the other side of the wall`
            },
            {
                title: `Stay where you are`
            },
        ]
    },
    {
        prompt: `
It was, in fact, someone smashing down the wall with a hammer. He looks to be a giant blue orc.
He screams in your face, spittle flying everywhere, 'You! Come join revolution! Smash the system! Smash hierarchy! Smash castle! Join!'
`,
        filter: (state: StoryState) => true,
        options: [
            {
                title: `Attempt to run around the orc, out into the sunlight`,
                action: { joinedCarl: false }
            },
            {
                title: `Join the revolution`,
                action: { joinedCarl: true }
            },
        ]
    },
    // If you joined Carl
    {
        prompt: `The orc says, 'Me name Carl. Me son of Barl, and father of Darl. Follow me, we don't have much time.`,
        filter: (state: StoryState) => state.joinedCarl === true,
        options: [{ title: '->' }]
    },
    {
        prompt: `You follow Carl across a sunlit forest.`,
        filter: (state: StoryState) => true,
        options: [{ title: '->' }]
    },
    // If you ran away
    {
        prompt: `The orc shouts after you, but once you get far enough away he starts mumbling about wishing he were more convincing.`,
        filter: (state: StoryState) => state.joinedCarl === false,
        options: [{ title: '->' }]
    },
    {
        prompt: `You're back out in the fresh air.`,
        filter: (state: StoryState) => true,
        options: [{ title: '->' }]
    },
    {
        prompt: `The end.`,
        filter: (state: StoryState) => true,
        options: []
    },
]

// section where you join carl and attempt to take down the system
// section where you escape and come upon carl later on
// in between filler section with some trials in a forest

const story: Story = {
    id: '239c41f0-9c9f-4f30-b322-e7d288eadd8e',
    name: 'Out of the Cave',
    actions,
    defaultState
}

export default story