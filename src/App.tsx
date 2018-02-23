import * as React from "react"
import {
  Platform,
  StyleSheet,
  Text,
  Modal,
  View,
  TextInput,
  StatusBar,
  AsyncStorage
} from "react-native"

const usernameStorageKey = "username_entry"

import PartyView from "./pages/PartyView"

import commonStyles from "./styles/commonStyles"

import { Player } from "./types/Player"
import { Story } from "./types/Story"
import HeroButton from "./components/HeroButton"
import { joinRoom, createRoom, roomDefaultState } from "./firebaseFunctions"
import { getStory } from "./actions/StoryDB"
import colors from "./styles/colors"
import RoomSetupView from "./pages/RoomSetupView"
import StoryBuilderView from "./pages/StoryBuilderView"
import StartPageView from "./pages/StartPageView"
import { appStore } from "./stores/AppStore"
import { observer } from "mobx-react"

type AppState = {}

type AppProps = {}

@observer
export default class App extends React.Component<AppProps> {
  constructor(props: any) {
    super(props)
  }

  componentWillMount() {
    this._loadUsername()
  }

  _loadUsername() {
    const storedUsername = AsyncStorage.getItem(usernameStorageKey)
      .then(value => {
        if (value !== null) {
          this.setState({ playerName: value })
        }
      })
      .catch(error => console.warn(error))
  }

  _updateUsername() {
    AsyncStorage.setItem(usernameStorageKey, appStore.playerName)
  }

  joinRoom() {
    const { roomCode, playerName } = appStore
    joinRoom(roomCode, playerName).then((storyID: string) => {
      const story = getStory(storyID)
        .then((story: Story) => {
          this._updateUsername()
          appStore.enterRoom(roomCode, story)
        })
        .catch(e => {
          console.log(e)
        })
    })
  }

  createRoom(storyID: string) {
    if (storyID === "") {
      alert("Select a story first.")
      return
    }
    const { playerName } = appStore
    const story = getStory(storyID).then((story: Story) => {
      createRoom(playerName, story).then((roomCode: string) => {
        this._updateUsername()
      })
    })
  }

  render() {
    switch (appStore.navigationLocation) {
      case "roomSetup":
        return <RoomSetupView />
      case "storyBuilder":
        return <StoryBuilderView />
      case "party":
        return <PartyView />
      case "startPage":
        return <StartPageView />
      default:
        return <StartPageView />
    }
  }
}
