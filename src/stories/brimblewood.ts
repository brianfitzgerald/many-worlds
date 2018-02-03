import { StoryState, StoryAction, Story } from "../types/Story";
import { next } from "../actions/Story";

const defaultState: StoryState = {
  swampBranchChosen: false,
  appleEaten: false,
  wellRested: false,
  slimeGivenFood: false
};

const actions: StoryAction[] = [
  {
    prompt: `
Your party leaves the inn and hits the road for another day of walking. Brimblewood is still another couple of weeks away,
but spirits are high and the sun is out today.
`,
    filter: state => true,
    options: [{ title: "->" }]
  },
  {
    prompt: `Soon, you reach a fork in the road. One leads into a swamp, and the other goes higher into the mountains. They both
lead to Brimblewood. Which do you choose?
`,
    filter: state => state.name !== "not_sure",
    options: [
      { title: "Cave", action: { swampBranchChosen: false } },
      { title: "Swamp", action: { swampBranchChosen: true } }
    ]
  },
  // Swamp
  {
    filter: state => state.swampBranchChosen === true,
    prompt: `
The swamp is dank, and reeks of frog piss. Your party follows a creaky wooden bridge across the murk.
Suddenly, a frog-man hops in front of your path!
`,
    options: [
      {
        title: "Give him some of your rations",
        action: { fewerRations: true }
      },
      { title: "Attempt to ignore him" }
    ]
  },
  {
    filter: state => state.swampBranchChosen === true,
    prompt: `'REEEEE!', the frog-man says. He jumps back into the lake, but not before splashing you one more time.`,
    options: [{ title: "->", action: { wetFromFrogman: true } }]
  },
  {
    filter: () => true,
    prompt: `There is a shiny apple on a tree above you.`,
    options: [
      {
        title: "eat it",
        action: {
          appleEaten: true
        }
      },
      {
        title: "ignore it"
      }
    ]
  },
  {
    prompt: `A low level slime blocks your path. 'Must consume!' it says.`,
    options: [
      {
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
    prompt: `Dawn of the second day.`,
    options: [next]
  },
  {
    prompt: `Your stomach begins to rumble, but it's probably not serious..`,
    filter: state => state.appleEaten === true
  },
  {
    filter: state => state.slimeGivenFood === true,
    prompt: `You awake to several slimes crowding around your tent. 'Consume! Consume! Consume! they chant.`,
    options: [
      {
        title: "Give them more food",
        response: "They ooze away, for now."
      },
      {
        title: "Swing your sword at them",
        response: "They suffocate you to death.",
        type: "end"
      }
    ]
  },
  {
    prompt: `As you walk through the forest, you encounter a centaur that looks at you, and then walks away.`,
    type: "end"
  }
];

// section where you join carl and attempt to take down the system
// section where you escape and come upon carl later on
// in between filler section with some trials in a forest

const story: Story = {
  id: "820ebcfa-547e-4809-93c8-ad7008d782a8",
  name: "Brimblewood",
  description: "A friendly jaunt",
  actions,
  defaultState
};

export default story;
