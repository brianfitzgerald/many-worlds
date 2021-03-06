import { observable, action, useStrict, computed } from "mobx"
import { Story } from "../types/Story"
import { getFeaturedStories, getMyStories } from "../actions/StoryDB";

export type NavigationLocation =
  | "roomSetup"
  | "storyBuilder"
  | "party"
  | "startPage"
  | "tutorial"

export default class AppStore {
  @observable public playerName: string = ""
  @observable public playerID: string = ""
  @observable public firstTime: boolean = true
  @observable public roomCode: string = ""
  @observable public currentStory?: Story
  @observable public singleplayer: boolean = false
  @observable public navigationLocation?: NavigationLocation

  @observable public featuredStories: Story[] = []
  @observable public myStories: Story[] = []
  @observable public storiesLoaded: boolean = false

  public testMode: boolean = false

  @action
  updateInitialValues(playerName: string, id: string, firstTime: boolean) {
    this.playerName = playerName
    this.playerID = id
    this.firstTime = firstTime
  }

  @action
  getStories() {
    getFeaturedStories()
      .then(featuredStories => {
        this.featuredStories = featuredStories
        if (this.playerName !== "") {
          getMyStories(appStore.playerName)
            .then(myStories => {
              this.myStories = myStories
              this.storiesLoaded = true
            })
            .catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err))

  }

  @action
  closeModal() {
    this.navigationLocation = "startPage"
    this.firstTime = false
    this.currentStory = undefined
  }

  @action
  enterRoom(roomCode: string, story: Story) {
    this.navigationLocation = "party"
    this.roomCode = roomCode
    this.currentStory = story
  }

  @action
  leaveRoom() {
    this.roomCode = ""
    this.singleplayer = false
    if (this.testMode) {
      this.navigationLocation = "storyBuilder"
    } else {
      this.navigationLocation = "startPage"
      this.currentStory = undefined
    }
  }

  @action
  updateStory(story: Story) {
    this.currentStory = story
  }

  @action
  enterSingleplayer(story: Story, testMode: boolean = false) {
    this.currentStory = story
    this.navigationLocation = "party"
    this.singleplayer = true
    this.testMode = testMode
  }

  @action
  enterStoryBuilder(story?: Story) {
    this.currentStory = story
    this.navigationLocation = "storyBuilder"
  }

  @action
  updatePlayerName(playerName: string) {
    this.playerName = playerName
  }

  @action
  leaveStoryBuilder() {
    this.navigationLocation = "startPage"
    this.testMode = false
  }
}

export const appStore = new AppStore()
