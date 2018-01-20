import { StoryState, StoryAction, Story } from "../types/Story";
import { next } from "../actions/Story";

const defaultState = {
    waitedForVehicle: false
}

const actions: StoryAction[] = [
    {
        prompt: `
You're deep into the Mojave desert when your car starts making weird noises, then concerning ones,
before the back wheels pop off. You're hours away from anywhere...
`,
        actionFilter: (state: StoryState) => true,
        options: [next]
    },
    {
        prompt: `
Your party has to make a decision. Do you try to wait for a passing vehicle, or walk along the road until you find something?`,
        actionFilter: (state: StoryState) => state.name === 'not_sure',
        options: [
            {
                title: `Wait for a passing vehicle`,
                action: {
                    waitedForVehicle: true
                }
            },
            {
                title: `Walk along the road`,
                action: {
                    waitedForVehicle: false
                }
            }
        ]
    },
    {
        prompt: `
Your party waits for a while, but no cars come. The sun begins to set in the sky. Right when everyone is about to go to bed, you see a light in the distance.
It starts to get closer...
`,
        actionFilter: (state: StoryState) => state.waitedForVehicle === true,
        options: [next]
    },
    {
        prompt: `It can't be a car, it's moving much too fast...`,
        actionFilter: (state: StoryState) => true,
        options: [next]
    },
    {
        prompt: `And all of a sudden, it's a above you, a greal whirling metal cylinder. A beam of light descends..`,
        actionFilter: (state: StoryState) => true,
        options: [
            {
                title: "Hide inside the car",
                action: {
                    hideInsideCar: true
                }
            },
            {
                title: "Stand and await whatever is about to happen next",
                action: {
                    hideInsideCar: true
                }
            }
        ]
    },
    {
        prompt: `
'Get in!' You all pile into the car. As you peek your heads outside the window, you see two shapes emerge from the light.

`,
        actionFilter: (state: StoryState) => state.hideInsideCar === true,
        options: [next]
    },
]

// section where you join carl and attempt to take down the system
// section where you escape and come upon carl later on
// in between filler section with some trials in a forest

const story: Story = {
    id: '0346d80a-c170-4d96-a61e-2a0e786665ba',
    name: 'Demons in the Dust',
    actions,
    defaultState
}

export default story