import { Player } from "./Player";
import { StoryState, StoryAction, HistoryItem } from "./Story";

export type FirebaseRoomState = {
    currentStoryIndex: number
    connectedPlayers?: Player[]
    storyState?: StoryState
    history?: HistoryItem[]
    storyID: string
}
export type RoomState = {
    currentStoryIndex: number
    storyID: string
    connectedPlayers: Player[]
    storyState: StoryState
    history: HistoryItem[]
}