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
    name: '',
    conditions: [],
    inventory: [],
    abilities: []
}

export type Player = {
    name: string
    conditions: Condition[]
    inventory: InventoryItem[]
    abilities: Ability[]
    selectedChoiceIndex?: number
}
