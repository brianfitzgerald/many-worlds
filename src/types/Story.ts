import { InventoryItem, Condition, Ability } from "./Player"

export const emptyStory: Story = {
  id: "",
  title: "",
  published: false,
  description: "",
  author: "",
  actions: [],
  defaultState: {}
}

export type Story = {
  id: string
  title: string
  published: boolean
  author: string
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
  filter?: StoryState
  playerStateChange?: {
    allPlayers?: PlayerStateChange
    self?: PlayerStateChange
  }
  response?: string
}

export type StoryAction = {
  type?: "boolean" | "end"
  prompt: string
  filter?: StoryState
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
