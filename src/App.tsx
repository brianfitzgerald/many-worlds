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

import PartyView from "./pages/PartyView"

import commonStyles from "./styles/commonStyles"

import { Player } from "./types/Player"
import { Story } from "./types/Story"
import HeroButton from "./components/HeroButton"
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

  render() {
    switch (appStore.navigationLocation) {
      case "roomSetup":
        return <RoomSetupView />
      case "storyBuilder":
        return <StoryBuilderView />
      case "party":
        return <PartyView />
      case "start":
        return <StartPageView />
      default:
        return <StartPageView />
    }
  }
}
