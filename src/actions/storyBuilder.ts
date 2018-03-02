import { FilterPair } from "../pages/StoryBuilderView"
import { Story } from "../types/Story"
import brimblewood from "../stories/brimblewood"
import * as util from "util"
import { uuidv4 } from "../utils"

export const buildStory = (
  story: Story,
  filters: FilterPair[],
  publish: boolean
): Story => {
  let formattedStory = addFiltersFromFilterPairs(story, filters)
  formattedStory.id = uuidv4()
  formattedStory.description = "A fun romp"
  formattedStory.published = publish
  return formattedStory
}

const addFiltersFromFilterPairs = (story: Story, filters: FilterPair[]) => {
  let formattedStory = story
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
  return formattedStory
}
