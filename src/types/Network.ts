import { Player } from "./Player";
import { StoryState, StoryAction, HistoryItem } from "./Story";

export type FirebaseRoomState = {
    status: 'in_play' | 'ended'
    currentStoryIndex: number
    connectedPlayers?: Player[]
    storyState?: StoryState
    history?: HistoryItem[]
    storyID: string
}
export type RoomState = {
    status: 'in_play' | 'ended'
    currentStoryIndex: number
    storyID: string
    connectedPlayers: Player[]
    storyState: StoryState
    history: HistoryItem[]
}