import * as React from "react";
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
} from "react-native";
import commonStyles from "../styles/commonStyles";
import HeroButton from "../components/HeroButton";
import colors from "../styles/colors";

import { dbInstance } from "../firebaseRef";
import { Story, StoryOption } from "../types/Story";
import { Player } from "../types/Player";
import {
  getNextActionIndex,
  doAction,
  getActionByIndex
} from "../actions/Story";
import { RoomState, FirebaseRoomState } from "../types/Network";
import { roomDefaultState, updateRoomState } from "../firebaseFunctions";
import { storyStore } from "../actions/StoryDB";
import StoryListItem from "../components/StoryListItem";

type RoomSetupViewProps = {
  onStoryBeginPressed: () => void;
  onCloseModal: () => void;
};

type RoomSetupViewState = {
  selectedStoryID: string;
};

export default class PartyView extends React.Component<
  RoomSetupViewProps,
  RoomSetupViewState
> {
  constructor(props: RoomSetupViewProps) {
    super(props);

    this.state = {
      selectedStoryID: ""
    };
  }

  selectStory(story: Story) {
    this.setState({
      selectedStoryID: story.id
    });
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
        {storyStore.map((story, i) => (
          <StoryListItem
            key={i}
            story={story}
            selected={story.id === this.state.selectedStoryID}
            onPress={this.selectStory.bind(this, story)}
          />
        ))}
        <HeroButton
          title="Begin"
          onPress={this.props.onStoryBeginPressed.bind(
            this,
            this.state.selectedStoryID
          )}
        />
      </View>
    );
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
});
