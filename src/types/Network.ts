import { Player } from "./Player";
import { StoryState, StoryAction } from "./Story";

export type RoomState = {
    currentStoryIndex: number
    connectedPlayers: Player[]
    storyState: StoryState
    history: StoryAction[]
}