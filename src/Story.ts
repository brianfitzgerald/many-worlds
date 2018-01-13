import Player, { InventoryItem, Condition, Ability } from "./Player";

export type StoryState = {
    [key: string]: string | boolean
}

export type StoryOption = {
    title: string
    action: {
        [key: string]: string | boolean
    }
}

export type Action = {
    prompt: string
    actionFilter: (state: StoryState) => boolean
    options: StoryOption[]
    playerStateChange?: {
        allPlayers?: PlayerStateChange
        self?: PlayerStateChange
    }
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

    actions: Action[]
    state: StoryState
    currentStoryIndex: number
    history: Action[]

    constructor(initialState: StoryState, actions: Action[]) {
        this.state = initialState
        this.actions = actions
        this.currentStoryIndex = 0
        this.history = []
    }

    getCurrentAction(): Action {
        return this.actions[this.currentStoryIndex]
    }

    goToNextAction(): Action {
        let nextStoryIndex = this.currentStoryIndex + 1

        if (this.actions[nextStoryIndex].actionFilter === null || this.actions[nextStoryIndex].actionFilter === undefined) {
            return this.actions[nextStoryIndex]
        }

        while (this.actions[nextStoryIndex] !== undefined && this.actions[nextStoryIndex].actionFilter(this.state) !== true) {
            nextStoryIndex++
        }
        this.currentStoryIndex = nextStoryIndex

        return this.actions[nextStoryIndex]
    }

    doAction(newAction: Action, players: Player[]) {

        players.forEach(player => {
            if (newAction.playerStateChange) {
                if (newAction.playerStateChange.allPlayers && newAction.playerStateChange.allPlayers.newItems) {
                    player.inventory = player.inventory.concat(newAction.playerStateChange.allPlayers.newItems)
                }
            }
        })

        const lastActionBeforeNewOne = this.getCurrentAction()
        this.history.push(lastActionBeforeNewOne)
        this.state = { ...this.state, ...newAction.options }
    }
}
