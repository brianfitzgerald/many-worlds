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
import { getFeaturedStories } from "../actions/StoryDB"

type RoomSetupViewProps = {
  onStoryBeginPressed: () => void
  onCloseModal: () => void
}

type SortOption = "AverageRating" | "Alphabetical"

type RoomSetupViewState = {
  selectedStoryID: string
  stories: Story[]
  selectedSortOption: SortOption
}

const sortStories = (stories: Story[], option: SortOption): Story[] => {
  if (option === "Alphabetical") {
    return stories.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
  }

  return stories
}

export default class PartyView extends React.Component<
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

  componentDidMount() {
    getFeaturedStories()
      .then(stories => {
        console.log(stories)
        this.setState({ stories })
      })
      .catch(err => console.log(err))
  }

  selectStory(story: Story) {
    this.setState({
      selectedStoryID: story.id
    })
  }

  changeSort(selectedSortOption: SortOption) {
    this.setState({ selectedSortOption })
  }

  render() {
    if (this.state.stories.length < 1) {
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

    const sortButtons = (
      <View>
        <Button
          color={colors.white}
          title="Sort by Rating"
          onPress={this.changeSort.bind(this, "AverageRating")}
        />
        <Button
          color={colors.white}
          title="Sort by Title"
          onPress={this.changeSort.bind(this, "Alphabetical")}
        />
      </View>
    )

    return (
      <View style={[commonStyles.container, styles.partyContainer]}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        <Button
          title="Cancel"
          color={colors.white}
          onPress={this.props.onCloseModal}
        />
        {sortButtons}
        <ScrollView>
          {sortedStories.map((story: Story, i) => (
            <StoryListItem
              key={i}
              story={story}
              selected={story.id === this.state.selectedStoryID}
              onPress={this.selectStory.bind(this, story)}
            />
          ))}
        </ScrollView>
        <HeroButton
          title="Begin"
          onPress={this.props.onStoryBeginPressed.bind(
            this,
            this.state.selectedStoryID
          )}
        />
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
