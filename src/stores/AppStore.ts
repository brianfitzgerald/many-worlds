import { observable, action, useStrict } from "mobx"
import { Story } from "../types/Story"

export type NavigationLocation =
  | "roomSetup"
  | "storyBuilder"
  | "party"
  | "startPage"

export default class AppStore {
  @observable public playerName: string = ""
  @observable public roomCode: string = ""
  @observable public currentStory?: Story
  @observable public navigationLocation?: NavigationLocation

  @action
  public startGame() {}

  @action
  closeModal() {
    this.navigationLocation = "startPage"
    this.currentStory = undefined
  }

  @action
  enterRoom(roomCode: string, story: Story) {
    this.navigationLocation = "party"
    this.roomCode = roomCode
    this.currentStory = story
  }

  @action
  enterSingleplayer(story?: Story) {
    if (!story) {
      alert("no story chosen")
    }
    this.currentStory = story
    this.navigationLocation = "party"
  }

  @action
  enterStoryBuilder(story: Story) {
    this.navigationLocation = "storyBuilder"
    this.currentStory = story
  }
}

useStrict(true)
export const appStore = new AppStore()
