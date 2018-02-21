import { StoryState, StoryAction, Story } from "../types/Story"
import { next } from "../actions/Story"

const story: Story = {
  author: "Brian Fitzgerald",
  id: "820ebcfa-547e-4809-93c8-ad7008d782a8",
  name: "Brimblewood",
  published: true,
  description: "A fun romp",
  actions: [
    {
      prompt:
        "Your party leaves the inn and hits the road for another day of walking. Brimblewood is still another couple of weeks away, but spirits are high and the sun is out today.",
      options: [
        {
          title: "->"
        }
      ]
    },
    {
      prompt: "There is a shiny apple on a tree above you.",
      options: [
        {
          title: "eat it"
        },
        {
          title: "store it in your bag",
          action: {
            applePicked: true
          }
        },
        {
          title: "ignore it"
        }
      ]
    },
    {
      prompt:
        "Soon, you reach a fork in the road. One leads into a swamp, and the other goes higher into the mountains. They both lead to Brimblewood. Which do you choose?",
      options: [
        {
          title: "Cave",
          action: {
            swampBranchChosen: false
          }
        },
        {
          title: "Swamp",
          action: {
            swampBranchChosen: true
          }
        }
      ]
    },
    {
      filter: {
        swampBranchChosen: true
      },
      prompt:
        " The swamp is dank, and reeks of frog piss. Your party follows a creaky wooden bridge across the murk. Suddenly, a frog-man hops in front of your path!",
      options: [
        {
          title: "Give him a bite of your apple",
          filter: {
            applePicked: true
          },
          action: {
            fewerRations: true
          }
        },
        {
          title: "Attempt to ignore him"
        }
      ]
    },
    {
      filter: {
        swampBranchChosen: true
      },
      prompt:
        "'REEEEE!', the frog-man says. He jumps back into the lake, but not before splashing you one more time.",
      options: [
        {
          title: "->"
        }
      ]
    },
    {
      prompt: "A low level slime blocks your path. 'Must consume!' it says.",
      options: [
        {
          filter: {
            applePicked: true
          },
          title: "give it some food",
          action: {
            slimeGivenFood: true
          },
          response: "The slime recedes."
        },
        {
          title: "veer off the path, into the woods"
        }
      ]
    },
    {
      prompt: "The sun begins to set.",
      options: [
        {
          title: "Set up camp",
          action: {
            wellRested: true
          }
        },
        {
          title: "Walk on through the night"
        }
      ]
    },
    {
      prompt:
        "As your group is about to hit the hay, you hear some rustling in the bushes.Your group unsheathes their weapons, and splits the bush...",
      options: [
        {
          title: "->"
        }
      ]
    },
    {
      prompt:
        "...Revealing a small child, in a burlap sack! He's clutching a pile of the loot you took from the Lich King.  'Please, I need this to pay for food tonight!' he squeals.",
      options: [
        {
          title: "Take back your gear, and scold the boy",
          action: {
            lootGivenToBoy: "none"
          }
        },
        {
          title: "Give the boy a few shillings to pay for food",
          action: {
            lootGivenToBoy: "some"
          }
        },
        {
          title: "Give the boy all your loot",
          action: {
            lootGivenToBoy: "lots"
          }
        }
      ]
    },
    {
      prompt: "Dawn of the second day.",
      options: [
        {
          title: "->"
        }
      ]
    }
  ],
  defaultState: {
    swampBranchChosen: false,
    applePicked: false,
    wellRested: false,
    slimeGivenFood: false
  }
}

export default story
