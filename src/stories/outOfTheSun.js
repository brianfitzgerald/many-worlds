const defaultState = {
    applePickedUp: false,
    appleEaten: false,
    voidApproached: true
}

// schema:
// actions have a prompt and a filter, which is a function that determines if the prompt is hit
// actions act upon state, which 
// once an action is hit, it cannot be hit again; there is a currentActionIndex which increments

const actions = [
    {
        prompt: 'You see an apple on the floor.',
        actionFilter: (state) => state.applePickedUp === true,
        actions: [
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
        actionFilter: (state) => state.applePickedUp === true,
        actions: [
            {
                title: 'Eat apple',
                action: {
                    appleEaten: true
                },
            },
            {
                title: 'Drop apple',
                action: null,
            },
        ]
    },
    {
        prompt: 'You live a happy and successful life.',
        actionFilter: (state) => state.appleEaten === false,
        actions: []
    },
    {
        prompt: 'You begin to feel ill. Your head hits the ground, and you being convulsing. A black void grows before you.',
        actionFilter: (state) => state.appleEaten === true,
        playerStateChange: {
            all: {
                newItems: [{ name: 'Apple', description: 'A suspicious fruit'}]
            }
        },
        actions: [
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
        actionFilter: (state) => state.voidApproached === true,
        actions: []
    }
]

export default { defaultState, actions }