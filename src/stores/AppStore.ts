import { observable, action } from "mobx"
import { Story } from "../types/Story"

export type NavigationLocation =
  | "createRoom"
  | "storyBuilder"
  | "inGame"
  | "startPage"

export default class AppStore {
  @observable public playerName: string = ""
  @observable public roomCode: string = ""
  @observable public currentStory?: Story
  @observable public inRoom?: boolean
  @observable public navigationLocation?: NavigationLocation

  @action
  public startGame() {}

  @action
  closeModal() {
    this.navigationLocation = "startPage"
    this.currentStory = undefined
  }

  @action
  enterRoom() {
    this.navigationLocation = "inGame"
    this.currentStory = undefined
  }
}

export const appStore = new AppStore()
