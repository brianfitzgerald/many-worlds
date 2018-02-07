import { StoryAction, StoryState, Story } from "../types/Story"

const defaultState = {
  applePickedUp: false,
  appleEaten: false,
  voidApproached: true
}

// schema:
// actions have a prompt and a filter, which is a function that determines if the prompt is hit
// actions act upon state, which
// once an action is hit, it cannot be hit again; there is a currentActionIndex which increments

const actions: StoryAction[] = [
  {
    prompt: "You see an apple on the floor.",
    options: [
      {
        title: "Pick it up",
        action: {
          applePickedUp: true
        }
      }
    ]
  },
  {
    prompt: "The apple is covered in mold.",
    filter: { applePickedUp: true },
    options: [
      {
        title: "Eat apple",
        action: {
          appleEaten: true
        }
      },
      {
        title: "Drop apple"
      }
    ]
  },
  {
    prompt: "You live a happy and successful life.",
    filter: { appleEaten: false },
    options: []
  },
  {
    prompt:
      "You begin to feel ill. Your head hits the ground, and you being convulsing. A black void grows before you.",
    filter: { appleEaten: true },
    options: [
      {
        title: "Approach the void",
        action: {
          voidApproached: true
        }
      }
    ]
  },
  {
    prompt: "You are consumed. Game over.",
    filter: { voidApproached: true },
    options: []
  },
  {
    prompt: "You live a happy and fruitful life.",
    filter: { voidApproached: false },
    options: []
  }
]

const story: Story = {
  id: "f35e804d-19fd-4488-98d3-09344e81dc80",
  name: "Apple Disaster",
  actions,
  defaultState
}

export default story
