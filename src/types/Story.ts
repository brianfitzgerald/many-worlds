import { InventoryItem, Condition, Ability } from "./Player";


export type Story = {
    id: string
    name: string
    actions: StoryAction[]
    defaultState: StoryState
}

export type StoryState = {
    [key: string]: string | boolean
}

export type HistoryItem = string

export type StoryOption = {
    title: string
    action?: StoryState
    playerStateChange?: {
        allPlayers?: PlayerStateChange
        self?: PlayerStateChange
    },
    response?: string
}

export type StoryAction = {
    prompt: string
    actionFilter?: (state: StoryState) => boolean
    options: StoryOption[]
}

type PlayerStateChange = {
    newItems?: InventoryItem[]
    newConditions?: Condition[]
    newAbilities?: Ability[]

    lostItems?: InventoryItem[]
    lostConditions?: Condition[]
    lostAbilities?: Ability[]
}