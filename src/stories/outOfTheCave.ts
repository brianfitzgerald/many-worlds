import { StoryState, Action } from "../Story";

const defaultState = {
    name: '',
    wouldSteal: false
}

// schema:
// actions have a prompt and a filter, which is a function that determines if the prompt is hit
// actions act upon state, which 
// once an action is hit, it cannot be hit again; there is a currentActionIndex which increments

const actions: Action[] = [
    {
        prompt:`
You awake in a prison cell. The walls around you are some sort of bedrock, mottled with some sort of fungus, or a mucus, you can't tell.
The room pulses, but you figure that must be due to dehydration. You have no idea how long you've been in here.
Come to think of it, what was your name again?
`,
        actionFilter: () => true,
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
        actionFilter: (state) => state.name === 'not_sure',
        options: [{ title: '->' }]
    },
    {
        prompt: `Not the prettiest name in the world, but I suppose one doesn't have much say in the matter.`,
        actionFilter: (state) => state.name !== 'not_sure',
        options: [{ title: '->' }]
    },
    {
        prompt: `
Slumped against the wall of your cell, you wonder about how you might have wound up here.
Did you commit a crime? Maybe you got caught stealing something...
`,
        actionFilter: () => true,
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
        actionFilter: (state) => true,
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
He screams, 'You! Come join revolution! Smash the system! Smash hierarchy! Smash castle! Join!
`,
        actionFilter: (state) => true,
        options: [
            {
                title: `Attempt to run around the orc, out into the sunlight`,
                action: { attemptedToEscapeCarl: true }
            },
            {
                title: `Join the revolution`,
                action: { attemptedToEscapeCarl: false }
            },
        ]
    },
    {
        prompt: `The end.`,
        actionFilter: (state) => true,
        options: []
    },
]

// section where you join carl and attempt to take down the system
// section where you escape and come upon carl later on
// in between filler section with some trials in a forest

export default { defaultState, actions }