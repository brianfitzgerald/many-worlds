import { StoryAction, StoryState, StoryOption, Story } from "../types/Story";
import { Player } from "../types/Player";
import { RoomState } from "../types/Network";

export function getActionByIndex(story: Story, index: number): StoryAction {
    return story.actions[index]
}

export function getNextActionIndex(story: Story, currentState: StoryState, currentStoryIndex: number): number {
    let nextStoryIndex = currentStoryIndex + 1
    
    while (story.actions[nextStoryIndex] !== undefined && story.actions[nextStoryIndex].actionFilter(currentState) !== true) {
        nextStoryIndex++
    }

    return nextStoryIndex
}

export function doAction(roomState: RoomState, story: Story, currentStoryIndex: number, selectedOption: StoryOption): RoomState {

    roomState.connectedPlayers.forEach((player: Player) => {
        if (selectedOption.playerStateChange) {
            // add similar conditions and abilities logic here
            if (selectedOption.playerStateChange.allPlayers && selectedOption.playerStateChange.allPlayers.newItems) {
                player.inventory = player.inventory.concat(selectedOption.playerStateChange.allPlayers.newItems)
            }
        }
    })

    const lastActionBeforeNewOne = getActionByIndex(story, currentStoryIndex).prompt
    roomState.history.push(lastActionBeforeNewOne)

    if (selectedOption.action) {
        const newState: StoryState = { ...roomState.storyState, ...selectedOption.action }
        roomState.storyState = newState
    }

    return roomState
}
