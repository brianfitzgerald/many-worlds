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

export default class Player {

    name: string
    conditions: Condition[]
    inventory: InventoryItem[]
    abilities: Ability[]

    constructor(name: string) {
        this.name = name
        this.conditions = []
        this.inventory = []
        this.abilities = []
    }

}