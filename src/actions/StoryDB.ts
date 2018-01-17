import outOfTheCave from "../stories/outOfTheCave";
import { Story } from "../types/Story";

const storyStore: { id: string, story: Story }[] = [
    {
        id: '239c41f0-9c9f-4f30-b322-e7d288eadd8e',
        story: outOfTheCave
    }
]

export const getStory = (id: string) => new Promise<Story>((resolve, reject) => {
    resolve(storyStore[0].story)
})