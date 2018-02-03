import * as React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
  View,
  ScrollViewProps,
  ScrollViewStatic
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

type PartyViewProps = {
  story: Story;
  currentPlayerName: string;
  roomCode: string;
  dispatch?: (func: { type: string; value: RoomState }) => void;
};

type PartyViewState = {
  roomState: RoomState;
  currentTimer: number;
};

const TIMER_AMOUNT = 8;

const getPlayersWhoSelectedOption = (
  optionIndex: number,
  roomState: RoomState
) =>
  roomState.connectedPlayers.filter(p => p.selectedChoiceIndex === optionIndex);
const getCurrentBestSelection = (roomState: RoomState): number => {
  const playerVotes = roomState.connectedPlayers.map(
    (p: Player, i: number) => ({
      index: i,
      amount: p.selectedChoiceIndex ? p.selectedChoiceIndex : 0
    })
  );
  const sortedPlayerVotes = playerVotes.sort(
    (a, b) => (a && b ? a.amount - b.amount : -1)
  );
  return sortedPlayerVotes[0].index;
};

export default class PartyView extends React.Component<
  PartyViewProps,
  PartyViewState
> {
  private intervalRef: NodeJS.Timer | undefined;
  private timeoutRef: NodeJS.Timer | undefined;

  refs: {
    scrollView: any;
  };

  constructor(props: PartyViewProps) {
    super(props);

    this.state = {
      roomState: roomDefaultState,
      currentTimer: 0
    };

    this._executeAction = this._executeAction.bind(this);
  }

  _resetTimer() {
    if (this.intervalRef && this.timeoutRef) {
      clearInterval(this.intervalRef);
      clearTimeout(this.timeoutRef);
    }
    this.setState({ currentTimer: TIMER_AMOUNT });
    this.intervalRef = setInterval(() => {
      this.setState({ currentTimer: this.state.currentTimer - 1 });
    }, 1000);
    this.timeoutRef = setTimeout(() => {
      this._executeAction(getCurrentBestSelection(this.state.roomState));
      this._resetTimer();
    }, TIMER_AMOUNT * 1000);
  }

  componentDidMount() {
    const matchID = this.props.roomCode;
    dbInstance.ref(`/rooms/${matchID}/`).on("value", snap => {
      const updatedRoomState: FirebaseRoomState = snap
        ? (snap.val() as RoomState)
        : roomDefaultState;
      // this should be the only place where room state is updated
      const safeRoomState: RoomState = {
        status: updatedRoomState.status,
        storyID: updatedRoomState.storyID,
        currentStoryIndex: updatedRoomState.currentStoryIndex,
        connectedPlayers: updatedRoomState.connectedPlayers || [],
        storyState: updatedRoomState.storyState || { status: "in_play" },
        history: updatedRoomState.history || []
      };
      this.setState({ roomState: safeRoomState });
    });
    this._resetTimer();
  }

  _executeAction(optionIndex: number) {
    const scrollRef = this.refs.scrollView as ScrollViewStatic;

    const currentAction = getActionByIndex(
      this.props.story,
      this.state.roomState.currentStoryIndex
    );

    if (!currentAction.options) {
      return;
    }

    const option = currentAction.options[optionIndex];

    if (option.response) {
      alert(option.response);
    }

    const currentStoryIndex = this.state.roomState.currentStoryIndex;
    const nextStoryIndex = getNextActionIndex(
      this.props.story,
      this.state.roomState.storyState,
      currentStoryIndex
    );
    const newState = doAction(
      this.state.roomState,
      this.props.story,
      currentStoryIndex,
      option
    );

    newState.currentStoryIndex = nextStoryIndex;

    updateRoomState(this.props.roomCode, newState).then(() => {
      if (scrollRef) {
        scrollRef.scrollToEnd();
      }
      this._resetTimer();
    });
  }

  _chooseAction(optionIndex: number) {
    const numPlayersWhoConcur = getPlayersWhoSelectedOption(
      optionIndex,
      this.state.roomState
    );

    if (
      numPlayersWhoConcur.length ===
      this.state.roomState.connectedPlayers.length
    ) {
      this._executeAction(optionIndex);
    } else {
      const newConnectedPlayersState = this.state.roomState.connectedPlayers.map(
        p => {
          if (p.name === this.props.currentPlayerName) {
            p.selectedChoiceIndex = optionIndex;
          }
          return p;
        }
      );

      const newRoomState = this.state.roomState;
      newRoomState.connectedPlayers = newConnectedPlayersState;

      updateRoomState(this.props.roomCode, newRoomState);
    }
  }

  _finishStory() {}

  render() {
    const currentAction = getActionByIndex(
      this.props.story,
      this.state.roomState.currentStoryIndex
    );

    return (
      <View style={[commonStyles.container, styles.partyContainer]}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        <View>
          <Text style={{ color: "white" }}>Room {this.props.roomCode}</Text>
          <Text style={{ color: "white" }}>
            {this.state.currentTimer} Seconds Left
          </Text>
        </View>
        <ScrollView ref="scrollView">
          {this.state.roomState.history.map((p, i) => (
            <Text key={i} style={styles.promptText}>
              {p}
            </Text>
          ))}
          <Text style={styles.currentPromptText}>{currentAction.prompt}</Text>
        </ScrollView>
        <View>
          {currentAction.options
            ? currentAction.options.map((a, i) => (
                <View key={i}>
                  {getPlayersWhoSelectedOption(i, this.state.roomState).map(
                    (p, i) => (
                      <Text key={i} style={styles.playersWhoSelectedOption}>
                        {p.name}
                        {i > 0 ? ", " : ""}
                      </Text>
                    )
                  )}
                  <HeroButton
                    key={i}
                    title={a.title}
                    onPress={this._chooseAction.bind(this, i)}
                    style={styles.promptButton}
                  />
                </View>
              ))
            : null}
          {currentAction.type === "end" ? (
            <HeroButton
              title="Finish Story"
              onPress={this._finishStory.bind(this)}
              style={styles.promptButton}
            />
          ) : null}
        </View>
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
    marginTop: 4,
    paddingLeft: 5,
    paddingRight: 5
  }
});
