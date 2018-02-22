import { observable } from "mobx"
import { Story } from "../types/Story"

export type NavigationLocation =
  | "createRoom"
  | "storyBuilder"
  | "inGame"
  | "start"

export default class AppStore {
  @observable public playerName: string = ""
  @observable public roomCode: string = ""
  @observable public currentStory?: Story
  @observable public inRoom?: boolean
}
