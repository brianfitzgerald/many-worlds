import * as React from "react"
import {
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
  View,
  ScrollViewProps,
  ScrollViewStatic,
  Button
} from "react-native"
import commonStyles from "../styles/commonStyles"
import HeroButton from "../components/HeroButton"
import colors from "../styles/colors"

import { dbInstance } from "../firebaseRef"
import { Story, StoryOption } from "../types/Story"
import { Player } from "../types/Player"
import {
  getNextActionIndex,
  doAction,
  getActionByIndex
} from "../actions/Story"
import { RoomState, FirebaseRoomState } from "../types/Network"
import { roomDefaultState, updateRoomState } from "../firebaseFunctions"
import StoryListItem from "../components/StoryListItem"
import { fetchFeaturedStoriesRequest } from "../actions/StoryDB"
import { appStore } from "../stores/AppStore"

type RoomSetupViewProps = {}

type SortOption = "AverageRating" | "Alphabetical"

type RoomSetupViewState = {
  selectedStoryID: string
  stories: Story[]
  selectedSortOption: SortOption
}

const sortStories = (stories: Story[], option: SortOption): Story[] => {
  if (option === "Alphabetical") {
    return stories.sort((a, b) => {
      if (a.title < b.title) return -1
      if (a.title > b.title) return 1
      return 0
    })
  }

  return stories
}

export default class RoomSetupView extends React.Component<
  RoomSetupViewProps,
  RoomSetupViewState
  > {
  constructor(props: RoomSetupViewProps) {
    super(props)

    this.state = {
      selectedStoryID: "",
      stories: [],
      selectedSortOption: "Alphabetical"
    }
  }

  selectStory(story: Story) {
    this.setState({
      selectedStoryID: story.id
    })
  }

  _beginStory() {
    appStore.closeModal.bind(this, this.state.selectedStoryID)
  }

  render() {
    if (!appStore.currentStory) {
      return (
        <View style={[commonStyles.container, styles.partyContainer]}>
          <Text style={styles.promptButton}>Loading...</Text>
        </View>
      )
    }

    const sortedStories = sortStories(
      this.state.stories,
      this.state.selectedSortOption
    )

    return (
      <View style={[commonStyles.container, styles.partyContainer]}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        <Button
          title="Cancel"
          color={colors.white}
          onPress={appStore.closeModal}
        />
        <StoryListItem story={appStore.currentStory} />
        <HeroButton title="Begin" onPress={this._beginStory.bind(this)} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  promptText: {
    fontSize: 24,
    color: colors.grey
  },
  currentPromptText: {
    fontSize: 24,
    color: colors.white,
    textAlign: "left"
  },
  partyContainer: {
    flex: 1,
    flexDirection: "column"
  },
  playersWhoSelectedOption: {
    fontSize: 18,
    color: "white"
  },
  promptButton: {
    color: "white",
    fontSize: 32,
    width: "100%",
    textAlign: "center",
    marginBottom: 12,
    marginTop: 4
  }
})
