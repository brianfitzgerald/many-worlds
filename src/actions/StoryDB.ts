import { Story } from "../types/Story"

import appleDisaster from "../stories/appleDisaster"
import brimblewood from "../stories/brimblewood"

// Mock story database, will be replaced with DynamoDB actions at a later point
const storyStore: Story[] = [appleDisaster, brimblewood]

console.log(storyStore)

export const getStory = (id: string) =>
  new Promise<Story>((resolve, reject) => {
    const result = storyStore.find(s => s.id === id)
    if (result) {
      resolve(result)
    } else {
      reject("no such room found")
    }
  })

export const getStoryRemote = (id: string) =>
  new Promise<Story>((resolve, reject) => {
    const result = storyStore.find(s => s.id === id)
    if (result) {
      resolve(result)
    } else {
      reject("no such room found")
    }
  })
