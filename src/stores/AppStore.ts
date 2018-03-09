import { observable, action, useStrict, computed } from "mobx"
import { Story } from "../types/Story"
import { getFeaturedStories, getMyStories } from "../actions/StoryDB";

export type NavigationLocation =
  | "roomSetup"
  | "storyBuilder"
  | "party"
  | "start"

export default class AppStore {
  @observable public playerName: string = ""
  @observable public selfID: string = ""
  @observable public roomCode: string = ""
  @observable public currentStory?: Story
  @observable public singleplayer: boolean = false
  @observable public navigationLocation?: NavigationLocation

  @observable public featuredStories: Story[] = []
  @observable public myStories: Story[] = []
  @observable public storiesLoaded: boolean = false

  public testMode: boolean = false

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
    this.navigationLocation = "start"
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
      this.navigationLocation = "start"
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
    if (testMode) {
      this.testMode = true
    }
  }

  @action
  enterStoryBuilder(story?: Story) {
    this.navigationLocation = "storyBuilder"
    this.currentStory = story
  }

  @action
  updatePlayerName(playerName: string) {
    this.playerName = playerName
  }

  @action
  leaveStoryBuilder() {
    this.navigationLocation = "start"
  }
}

export const appStore = new AppStore()
