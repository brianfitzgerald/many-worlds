import * as React from "react"
import {
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
  View,
  ScrollViewProps,
  ScrollViewStatic
} from "react-native"
import commonStyles from "../styles/commonStyles"
import HeroButton from "../components/HeroButton"
import colors from "../styles/colors"

import { dbInstance } from "../firebaseRef"
import { Story, StoryOption, StoryState } from "../types/Story"
import { Player } from "../types/Player"
import {
  getNextActionIndex,
  doAction,
  getActionByIndex,
  validateFilter,
  getViableOptions,
  getCurrentBestSelection,
  getPlayersWhoSelectedOption
} from "../actions/Story"
import { RoomState, FirebaseRoomState } from "../types/Network"
import { roomDefaultState, updateRoomState, getSelf } from "../firebaseFunctions"
import { appStore } from "../stores/AppStore"
import StoryListItem from "../components/StoryListItem";

type StoryViewProps = {}

type StoryViewState = {
  roomState: RoomState
  currentTimer: number
}

const TIMER_AMOUNT = 15

export default class StoryView extends React.Component<
  StoryViewProps,
  StoryViewState
  > {
  private intervalRef: NodeJS.Timer | undefined
  private timeoutRef: NodeJS.Timer | undefined

  private firebaseListenerRef: firebase.database.Reference | undefined

  refs: any

  constructor(props: StoryViewProps) {
    super(props)

    const roomInitState = roomDefaultState

    if (appStore.singleplayer) {
      roomInitState.status = "in_game"
    }

    this.state = {
      roomState: roomInitState,
      currentTimer: 0
    }

    this._executeAction = this._executeAction.bind(this)
  }

  _resetTimer() {
    if (this.intervalRef && this.timeoutRef) {
      clearInterval(this.intervalRef)
      clearTimeout(this.timeoutRef)
    }
    this.setState({ currentTimer: TIMER_AMOUNT })
    this.intervalRef = setInterval(() => {
      this.setState({ currentTimer: this.state.currentTimer - 1 })
    }, 1000)
    this.timeoutRef = setTimeout(() => {
      this._executeAction(getCurrentBestSelection(this.state.roomState))
      this._resetTimer()
    }, TIMER_AMOUNT * 1000)
  }

  componentDidMount() {
    if (appStore.singleplayer) {
      return
    }
    const matchID = appStore.roomCode
    this.firebaseListenerRef = dbInstance.ref(`/rooms/${matchID}/`)
    this.firebaseListenerRef.on("value", snap => {
      const updatedRoomState: FirebaseRoomState = snap
        ? (snap.val() as RoomState)
        : roomDefaultState

      if (
        appStore.currentStory &&
        updatedRoomState.currentStoryIndex ===
        appStore.currentStory.actions.length
      ) {
        return
      }

      // this should be the only place where room state is updated
      const safeRoomState: RoomState = {
        status: updatedRoomState.status,
        storyID: updatedRoomState.storyID,
        currentStoryIndex: updatedRoomState.currentStoryIndex,
        connectedPlayers: updatedRoomState.connectedPlayers || [],
        storyState: updatedRoomState.storyState || {},
        history: updatedRoomState.history || []
      }
      this.setState({ roomState: safeRoomState })
    })
    this._resetTimer()
  }

  _executeAction(optionIndex: number) {
    const story = appStore.currentStory
    if (!story) return

    const scrollRef = this.refs.scrollView as ScrollViewStatic

    const currentAction = getActionByIndex(
      story,
      this.state.roomState.currentStoryIndex
    )

    if (!currentAction.options) {
      return
    }

    const option = currentAction.options[optionIndex]

    if (option.response) {
      alert(option.response)
    }

    const currentStoryIndex = this.state.roomState.currentStoryIndex
    const nextStoryIndex = getNextActionIndex(
      story,
      this.state.roomState.storyState,
      currentStoryIndex
    )
    const newState = doAction(
      this.state.roomState,
      story,
      currentStoryIndex,
      option
    )

    newState.currentStoryIndex = nextStoryIndex

    if (appStore.singleplayer) {
      this.setState({ roomState: newState })
      if (scrollRef) {
        scrollRef.scrollToEnd()
      }
      return
    }

    updateRoomState(appStore.roomCode, newState).then(() => {
      if (scrollRef) {
        scrollRef.scrollToEnd()
      }
      this._resetTimer()
    })
  }

  _chooseAction(optionIndex: number) {

    if (appStore.singleplayer) {
      this._executeAction(optionIndex)
      return
    }

    const numPlayersWhoConcur = getPlayersWhoSelectedOption(
      optionIndex,
      this.state.roomState
    )

    if (
      numPlayersWhoConcur.length ===
      this.state.roomState.connectedPlayers.length
    ) {
      this._executeAction(optionIndex)
    } else {
      const newConnectedPlayersState = this.state.roomState.connectedPlayers.map(
        p => {
          if (p.name === appStore.playerName) {
            p.selectedChoiceIndex = optionIndex
          }
          return p
        }
      )

      const newRoomState = this.state.roomState
      newRoomState.connectedPlayers = newConnectedPlayersState

      updateRoomState(appStore.roomCode, newRoomState)
    }
  }

  _leaveRoom() {
    if (!appStore.singleplayer) {
      appStore.leaveRoom()
      return
    }
    if (this.firebaseListenerRef) {
      this.firebaseListenerRef.ref.off()
      this.firebaseListenerRef.ref.remove()
    }
    if (this.intervalRef && this.timeoutRef) {
      clearInterval(this.intervalRef)
      clearTimeout(this.timeoutRef)
    }
    appStore.leaveRoom()
  }

  _readyUp() {
    const newRoomState = this.state.roomState
    const self = getSelf(newRoomState.connectedPlayers)
    if (self) {
      self.ready = true
    }
    if (newRoomState.connectedPlayers.filter((p) => !p.ready).length < 1) {
      newRoomState.status = "in_game"
    }
    updateRoomState(appStore.roomCode, newRoomState)
  }

  _selectAnotherStory(story: Story) {
    appStore.updateStory(story)
    const newRoomState = this.state.roomState
    newRoomState.storyState = {}
    newRoomState.currentStoryIndex = 0
    newRoomState.history = []
    if (appStore.singleplayer) {
      this.setState({ roomState: newRoomState })
      return
    }
    updateRoomState(appStore.roomCode, newRoomState)
  }

  render() {

    if (!appStore.currentStory) {
      return (
        <View style={[commonStyles.container, styles.partyContainer]}>
          <Text style={styles.roomCode}>Loading</Text>
        </View>
      )
    }

    if (this.state.roomState.status === "pregame") {
      return (
        <View style={[commonStyles.container, styles.partyContainer]}>
          <StatusBar backgroundColor={colors.black} barStyle="light-content" />
          {this.state.roomState.connectedPlayers.map((player) => {
            <Text style={styles.promptText}>{player.name}: {player.ready}</Text>
          })}
          <HeroButton title="Ready Up" onPress={() => this._readyUp()} />
        </View>
      )
    }

    const isAtStoryEnd =
      this.state.roomState.currentStoryIndex >=
      appStore.currentStory.actions.length

    const moreStories = appStore.featuredStories.slice(0, 2)

    if (isAtStoryEnd) {
      return (
        <View style={[commonStyles.container, styles.partyContainer]}>
          <StatusBar backgroundColor={colors.black} barStyle="light-content" />
          <Text style={[styles.titleText]}>The End</Text>
          <Text style={styles.currentPromptText}>Here are some more stories:</Text>
          {moreStories.map((story) => <StoryListItem story={story} onPress={this._selectAnotherStory.bind(this, story)} />)}
          <HeroButton title="Back to menu" onPress={() => this._leaveRoom()} />
        </View>
      )
    }

    const currentAction = getActionByIndex(
      appStore.currentStory,
      this.state.roomState.currentStoryIndex
    )

    return (
      <View style={[commonStyles.container, styles.partyContainer]}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.roomCode}>{appStore.roomCode}</Text>
          <Text style={styles.timer}>
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
          {getViableOptions(
            currentAction.options,
            this.state.roomState.storyState
          ).map((a, i) => (
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
          ))}
        </View>
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
  titleText: {
    fontSize: 48,
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15
  },
  promptButton: {
    width: "100%",
    marginBottom: 12,
    marginTop: 4,
    paddingLeft: 5,
    paddingRight: 5
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  timer: {
    paddingTop: 6,
    flex: 2,
    color: colors.white,
    textAlign: "right",
    fontSize: 18
  },
  roomCode: {
    paddingTop: 5,
    flex: 1,
    color: colors.white,
    textAlign: "left",
    fontSize: 20
  }
})
