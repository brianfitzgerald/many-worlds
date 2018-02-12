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
import { getAllStories } from "../actions/StoryDB"

type RoomSetupViewProps = {
  onStoryBeginPressed: () => void
  onCloseModal: () => void
}

type RoomSetupViewState = {
  selectedStoryID: string
  stories: Story[]
}

export default class PartyView extends React.Component<
  RoomSetupViewProps,
  RoomSetupViewState
> {
  constructor(props: RoomSetupViewProps) {
    super(props)

    this.state = {
      selectedStoryID: "",
      stories: []
    }
  }

  componentDidMount() {
    getAllStories()
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

  render() {
    return (
      <View style={[commonStyles.container, styles.partyContainer]}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        <Button
          title="Cancel"
          color={colors.white}
          onPress={this.props.onCloseModal}
        />
        <ScrollView>
          {this.state.stories.map((story: Story, i) => (
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
    width: "100%",
    marginBottom: 12,
    marginTop: 4
  }
})
