export class InventoryItem {
    constructor(name, description) {
        this.name = name
        this.description = description
    }
}

export default class Player {
    constructor(name) {
        this.name = name
        this.conditions = []
        this.inventory = []
        this.abilities = []
    }

}