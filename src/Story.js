export default class Story {
    constructor(initialState, actions) {
        this.state = initialState
        this.actions = actions
        this.currentStoryIndex = 0
        this.history = []
    }

    getCurrentAction() {
        return this.actions[this.currentStoryIndex]
    }

    goToNextAction() {
        let nextStoryIndex = this.currentStoryIndex + 1

        if (this.actions[nextStoryIndex] === undefined) return
        if (this.actions[nextStoryIndex].actionFilter === null || this.actions[nextStoryIndex].actionFilter === undefined) {
            return this.actions[nextStoryIndex]
        }

        while (this.actions[nextStoryIndex] !== undefined && this.actions[nextStoryIndex].actionFilter(this.state) !== true) {
            nextStoryIndex++
        }
        this.currentStoryIndex = nextStoryIndex

        return this.actions[nextStoryIndex]
    }

    doAction(newAction) {
        const currentPrompt = this.getCurrentAction().prompt
        this.history.push(currentPrompt)
        this.state = { ...this.state, ...newAction.action }
    }
}