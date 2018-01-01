
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
        console.log('goToNextAction state', this.state)
        console.log('next story filter', this.actions[nextStoryIndex].actionFilter(this.state))
        while (this.actions[nextStoryIndex].actionFilter(this.state) !== true && nextStoryIndex < this.actions.length) {
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