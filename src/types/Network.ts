import { Player } from "./Player";
import { StoryState, StoryAction, HistoryItem } from "./Story";

type RoomStatus = 'in_game' | 'ended' | 'pregame'

export type FirebaseRoomState = {
    status: RoomStatus
    currentStoryIndex: number
    connectedPlayers?: Player[]
    storyState?: StoryState
    history?: HistoryItem[]
    storyID: string
}
export type RoomState = {
    status: RoomStatus
    currentStoryIndex: number
    storyID: string
    connectedPlayers: Player[]
    storyState: StoryState
    history: HistoryItem[]
}