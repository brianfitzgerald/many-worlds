import outOfTheCave from "../stories/outOfTheCave";
import appleDisaster from "../stories/appleDisaster";
import demonsInTheDust from "../stories/demonsInTheDust";
import { Story } from "../types/Story";
import brimblewood from "../stories/brimblewood";

const storyStore: Story[] = [outOfTheCave, appleDisaster, demonsInTheDust, brimblewood]

export const getStory = (id: string) => new Promise<Story>((resolve, reject) => {
    const result = storyStore.find((s) => s.id === id)
    if (result) {
        resolve(result)
    } else {
        reject('no such room found')
    }
})