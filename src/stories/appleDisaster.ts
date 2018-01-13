import { StoryState, Action } from "../Story";

const defaultState = {
    applePickedUp: false,
    appleEaten: false,
    voidApproached: true
}

// schema:
// actions have a prompt and a filter, which is a function that determines if the prompt is hit
// actions act upon state, which 
// once an action is hit, it cannot be hit again; there is a currentActionIndex which increments

const actions: Action[] = [
    {
        prompt: 'You see an apple on the floor.',
        actionFilter: (state: StoryState) => state.applePickedUp === true,
        options: [
            {
                title: 'Pick it up',
                action: {
                    applePickedUp: true
                }    
            }
        ]
    },
    {
        prompt: 'The apple is covered in mold.',
        actionFilter: (state: StoryState) => state.applePickedUp === true,
        options: [
            {
                title: 'Eat apple',
                action: {
                    appleEaten: true
                },
            },
            {
                title: 'Drop apple'
            },
        ]
    },
    {
        prompt: 'You live a happy and successful life.',
        actionFilter: (state: StoryState) => state.appleEaten === false,
        options: []
    },
    {
        prompt: 'You begin to feel ill. Your head hits the ground, and you being convulsing. A black void grows before you.',
        actionFilter: (state: StoryState) => state.appleEaten === true,
        options: [
            {
                title: 'Approach the void',
                action: {
                    voidApproached: true
                },
            },
        ]
    },
    {
        prompt: 'You are consumed. Game over.',
        actionFilter: (state: StoryState) => state.voidApproached === true,
        options: []
    }
]

export default { defaultState, actions }