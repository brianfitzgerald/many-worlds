import { FilterPair } from "../pages/StoryBuilderView"
import { Story } from "../types/Story"

export const buildStory = (story: Story, filters: FilterPair[]): Story => {
  const formattedStory = story
  filters.forEach(filter => {
    formattedStory.actions.forEach((action, actionIndex) => {
      if (actionIndex === filter.targetIndex) {
        if (!action.filter) {
          action.filter = {}
        }
        action.filter[actionIndex] = filter.filterBooleanValue
      }
      if (actionIndex === filter.actionIndex) {
        action.options.forEach((option, optionIndex) => {
          if (optionIndex === filter.optionIndex) {
            if (!option.action) {
              option.action = {}
            }
            option.action[optionIndex] = filter.filterBooleanValue
          }
        })
      }
    })
  })
  console.log(formattedStory)
  return formattedStory
}

// action: {
//     544: true
// }

// {
//     filter: {
//         544: true
//     }
//     prompt: ""
// }
