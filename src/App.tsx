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

type AppState = {
  playerName: string
  roomCode: string
  story?: Story
  inRoom: boolean
  createRoomModalVisible: boolean
  selectedStoryID: string
}

type AppProps = {}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: any) {
    super(props)

    this.state = {
      playerName: "",
      roomCode: "",
      inRoom: false,
      createRoomModalVisible: false,
      selectedStoryID: ""
    }
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
    AsyncStorage.setItem(usernameStorageKey, this.state.playerName)
  }

  joinRoom() {
    const { roomCode, playerName } = this.state
    joinRoom(roomCode, playerName).then((storyID: string) => {
      const story = getStory(storyID)
        .then((story: Story) => {
          this._updateUsername()
          this.setState({
            inRoom: true,
            story,
            roomCode
          })
        })
        .catch(e => {
          console.log(e)
        })
    })
  }

  onFinish() {
    this.setState({
      inRoom: false
    })
  }

  showRoomSetup() {
    this.setState({ createRoomModalVisible: true })
  }

  hideRoomSetup() {
    this.setState({ createRoomModalVisible: false })
  }

  createRoom(storyID: string) {
    if (storyID === "") {
      alert("Select a story first.")
      return
    }
    const { playerName } = this.state
    const story = getStory(storyID).then((story: Story) => {
      createRoom(playerName, story).then((roomCode: string) => {
        this._updateUsername()
        this.setState({
          inRoom: true,
          createRoomModalVisible: false,
          roomCode,
          story
        })
      })
    })
  }

  render() {
    let page = null

    if (!this.state.inRoom) {
      page = (
        <View style={commonStyles.container}>
          <StatusBar backgroundColor={colors.black} barStyle="light-content" />
          <Modal visible={this.state.createRoomModalVisible}>
            <RoomSetupView
              onStoryBeginPressed={this.createRoom.bind(this)}
              onCloseModal={this.hideRoomSetup.bind(this)}
            />
          </Modal>
          <Text style={commonStyles.headerText}>What is your name?</Text>
          <TextInput
            placeholder="Name"
            placeholderTextColor={colors.grey}
            style={commonStyles.textInput}
            value={this.state.playerName}
            onChangeText={val => this.setState({ playerName: val })}
          />
          <Text style={commonStyles.headerText}>Where are you going?</Text>
          <TextInput
            placeholder="Room Code"
            placeholderTextColor={colors.grey}
            style={commonStyles.textInput}
            value={this.state.roomCode}
            onChangeText={val => this.setState({ roomCode: val })}
          />
          <HeroButton
            style={commonStyles.heroButtonMargins}
            title="Join Game"
            onPress={this.joinRoom.bind(this)}
          />
          <HeroButton
            title="Start New Game"
            onPress={this.showRoomSetup.bind(this)}
          />
        </View>
      )
    } else {
      page = (
        <PartyView
          currentPlayerName={this.state.playerName}
          story={this.state.story}
          roomCode={this.state.roomCode}
        />
      )
    }

    return page
  }
}
