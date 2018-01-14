import Player, { InventoryItem, Condition, Ability } from "./Player";

export type StoryState = {
    [key: string]: string | boolean
}

export type StoryOption = {
    title: string
    action?: StoryState
    playerStateChange?: {
        allPlayers?: PlayerStateChange
        self?: PlayerStateChange
    }
}

export type Action = {
    prompt: string
    actionFilter: (state: StoryState) => boolean
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

export default class StoryObject {

    private actions: Action[]
    private state: StoryState
    public history: Action[]

    constructor(initialState: StoryState, actions: Action[]) {
        this.actions = actions
        this.history = []
    }

    getActionByIndex(index: number): Action {
        return this.actions[index]
    }

    getNextActionIndex(currentState: StoryState, currentStoryIndex: number): number {
        let nextStoryIndex = currentStoryIndex + 1
        
        while (this.actions[nextStoryIndex] !== undefined && this.actions[nextStoryIndex].actionFilter(currentState) !== true) {
            nextStoryIndex++
            console.log(this.actions[nextStoryIndex]);
        }

        return nextStoryIndex
    }

    doAction(currentState: StoryState, currentStoryIndex: number, selectedOption: StoryOption, players: Player[]): StoryState {

        players.forEach(player => {
            if (selectedOption.playerStateChange) {
                // add similar conditions and abilities logic here
                if (selectedOption.playerStateChange.allPlayers && selectedOption.playerStateChange.allPlayers.newItems) {
                    player.inventory = player.inventory.concat(selectedOption.playerStateChange.allPlayers.newItems)
                }
            }
        })

        const lastActionBeforeNewOne = this.getActionByIndex(currentStoryIndex)
        this.history.push(lastActionBeforeNewOne)

        if (selectedOption.action) {
            const newState: StoryState = { ...this.state, ...selectedOption.action }
            return newState
        }

        return currentState
    }
}
