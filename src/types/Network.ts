import { Player } from "./Player";
import { StoryState, StoryAction, HistoryItem } from "./Story";

export type FirebaseRoomState = {
    currentStoryIndex: number
    connectedPlayers?: Player[]
    storyState?: StoryState
    history?: HistoryItem[]
}
export type RoomState = {
    currentStoryIndex: number
    connectedPlayers: Player[]
    storyState: StoryState
    history: HistoryItem[]
}