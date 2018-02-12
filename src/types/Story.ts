import { InventoryItem, Condition, Ability } from "./Player"

export type Story = {
  id: string
  name: string
  averageRating: number
  description: string
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
  }
  response?: string
  type?: "end"
}

export type StoryAction = {
  type?: "boolean" | "end"
  prompt: string
  filter?: StoryState
  options?: StoryOption[]
}

type PlayerStateChange = {
  newItems?: InventoryItem[]
  newConditions?: Condition[]
  newAbilities?: Ability[]

  lostItems?: InventoryItem[]
  lostConditions?: Condition[]
  lostAbilities?: Ability[]
}
