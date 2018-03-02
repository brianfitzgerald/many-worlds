export type Condition = {
    name: string
}

export type InventoryItem = {
    name: string
    description?: string
}

export type Ability = {
    name: string
    description?: string
}

export const playerDefaultState: Player = {
    id: '',
    name: '',
    ready: false,
    conditions: [],
    inventory: [],
    abilities: []
}

export type Player = {
    id: string
    name: string
    ready: boolean
    conditions: Condition[]
    inventory: InventoryItem[]
    abilities: Ability[]
    selectedChoiceIndex?: number
}
