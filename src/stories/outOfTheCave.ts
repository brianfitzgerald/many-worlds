import { StoryState, Action } from "../Story";

const defaultState = {
    playerName: '',
}

// schema:
// actions have a prompt and a filter, which is a function that determines if the prompt is hit
// actions act upon state, which 
// once an action is hit, it cannot be hit again; there is a currentActionIndex which increments

const actions: Action[] = [
    {
        prompt:
`   You awake in a prison cell. The walls around you are some sort of bedrock, mottled with some sort of fungus, or a mucus, you can't tell.
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
        actionFilter: (state) => state.playerName === 'not_sure',
        options: []
    },
    {
        prompt: `Not the prettiest name in the world, but I suppose one doesn't have much say in the matter.`,
        actionFilter: (state) => state.playerName !== 'not_sure',
        options: []
    },
    {
        prompt: `Test`,
        actionFilter: () => true,
        options: []
    }
]

export default { defaultState, actions }