import outOfTheCave from "../stories/outOfTheCave";
import appleDisaster from "../stories/appleDisaster";
import { Story } from "../types/Story";

const storyStore: Story[] = [outOfTheCave, appleDisaster]

export const getStory = (id: string) => new Promise<Story>((resolve, reject) => {
    const result = storyStore.find((s) => s.id === id)
    if (result) {
        resolve(result)
    } else {
        reject()
    }
})