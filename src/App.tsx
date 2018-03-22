import * as React from "react"
import {
  Platform,
  StyleSheet,
  Text,
  Modal,
  View,
  TextInput,
  StatusBar,
  AsyncStorage,
  Button
} from "react-native"

import StoryView from "./pages/StoryView"

import { containerStyle, titleInput } from "./styles/commonStyles"

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
import { usernameStorageKey, idKey, isFirstTimeKey, uuidv4 } from "./utils";
import TutorialView from "./pages/TutorialView";

@observer
export default class App extends React.Component {
  constructor(props: any) {
    super(props)
  }

  componentWillMount() {
    AsyncStorage.multiGet([usernameStorageKey, idKey, isFirstTimeKey]).then((values) => {
      const name = values[0][1]
      let id = values[1][1]
      if (!id) {
        id = uuidv4()
      }
      const firstTime = values[2][1] === 'true' || values[2][1] === null
      appStore.updateInitialValues(name, id, firstTime)
    }).catch(error => console.warn(error))
  }

  render() {

    if (appStore.firstTime) {
      return <TutorialView />
    }

    switch (appStore.navigationLocation) {
      case "roomSetup":
        return <RoomSetupView />
      case "storyBuilder":
        return <StoryBuilderView />
      case "party":
        return <StoryView />
      case "startPage":
        return <StartPageView />
      default:
        return <StartPageView />
    }
  }
}
