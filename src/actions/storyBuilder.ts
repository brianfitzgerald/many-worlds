import { FilterPair } from "../pages/StoryBuilderView"
import { Story } from "../types/Story"
import brimblewood from "../stories/brimblewood"
import * as util from "util"

export const buildStory = (
  story: Story,
  filters: FilterPair[],
): Story => {
  let formattedStory = addFiltersFromFilterPairs(story, filters)
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
