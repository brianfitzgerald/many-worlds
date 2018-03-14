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
  Button,
  TextInput,
  Modal,
  TextStyle,
  ViewStyle,
  ImageStyle,
  AsyncStorage,
  AlertIOS,
  AlertAndroid,
  TouchableOpacity
} from "react-native"
import Swipeout from "react-native-swipeout"
import { observer } from "mobx-react"

import commonStyles, { containerStyle } from "../styles/commonStyles"
import HeroButton, { LightHeroButton, NewsItem } from "../components/HeroButton"
import colors from "../styles/colors"

import { joinRoom, createRoom, roomDefaultState } from "../firebaseFunctions"

import { dbInstance } from "../firebaseRef"
import { Story, StoryOption, StoryAction, emptyStory } from "../types/Story"
import { Player } from "../types/Player"
import {
  getNextActionIndex,
  doAction,
  getActionByIndex
} from "../actions/Story"
import { RoomState, FirebaseRoomState } from "../types/Network"
import StoryListItem from "../components/StoryListItem"
import { getFeaturedStories, getMyStories, getStory, deleteStory } from "../actions/StoryDB"
import StoryActionPromptInput from "../components/StoryActionInput"
import NewsItems from "../newsItems"
import { appStore } from "../stores/AppStore"
import { usernameStorageKey } from "../utils"

type StartPageProps = {}
type StartpageState = {
  myStories: Story[]
  showSelectStoryModal: boolean
  showJoinGameModal: boolean
  selectedStory?: Story
  roomCodeInput: string
}

@observer
export default class StartPageView extends React.Component<
StartPageProps,
StartpageState
> {
  constructor(props: StartPageProps) {
    super(props)
    this.state = {
      myStories: [],
      showSelectStoryModal: false,
      showJoinGameModal: false,
      roomCodeInput: ""
    }
  }

  _updateUsername() {
    AsyncStorage.setItem(usernameStorageKey, appStore.playerName)
  }

  componentDidMount() {

    appStore.getStories()

  }

  beginEditing(story: Story) {
    appStore.enterStoryBuilder(story)
  }

  selectStory(story: Story) {
    this.setState({
      selectedStory: story,
      showSelectStoryModal: true
    })
  }

  _updateName() {
    if (Platform.OS === "ios")
      AlertIOS.prompt("What is your name?", undefined, (nameInput: string) => {
        appStore.updatePlayerName(nameInput)
        AsyncStorage.setItem(usernameStorageKey, nameInput)
      })
  }

  _joinGamePressed(roomCodeInput: string) {
    const { playerName } = appStore
    AsyncStorage.setItem(usernameStorageKey, playerName)

    joinRoom(roomCodeInput, playerName).then((storyID: string) => {
      const story = getStory(storyID)
        .then((story: Story) => {
          this._updateUsername()
          appStore.enterRoom(roomCodeInput, story)
        })
        .catch(e => {
          console.log(e)
        })
    })
  }

  _createRoom(selectedStory: Story) {
    const { playerName } = appStore
    createRoom(playerName, selectedStory).then((roomCode: string) => {
      this._updateUsername()
      appStore.enterRoom(roomCode, selectedStory)
    })
  }

  _deleteStory(story: Story) {
    deleteStory(story).then(() => {
      appStore.getStories()
    })
  }

  render() {
    if (!appStore.storiesLoaded) {
      return (
        <View style={containerStyle}>
          <Text style={styles.promptButton}>Loading...</Text>
        </View>
      )
    }

    const featuredStories = appStore.featuredStories
    const myStories = appStore.myStories

    const selectedStory = this.state.selectedStory || emptyStory

    const selectStoryModal = (
      <Modal visible={this.state.showSelectStoryModal}>
        <View style={containerStyle}>
          <StoryListItem
            style={{ marginTop: 15 }}
            story={selectedStory}
            selected={false}
            onPress={() => { }}
          />
          <Button
            color={colors.white}
            title="Play this story with friends"
            onPress={() => this._createRoom(selectedStory)}
          />
          <Button
            color={colors.white}
            title="Play this story by yourself"
            onPress={() =>
              this.state.selectedStory ? appStore.enterSingleplayer(this.state.selectedStory) : undefined
            }
          />
          {selectedStory.author === appStore.playerName ? (
            <Button
              color={colors.white}
              title="Edit this story"
              onPress={this.beginEditing.bind(this, this.state.selectedStory)}
            />
          ) : null}
          <Button
            color={colors.white}
            title="Cancel"
            onPress={() => {
              this.setState({ showSelectStoryModal: false })
            }}
          />
        </View>
      </Modal>
    )

    const validRoomCodeAndName = this.state.roomCodeInput !== '' && appStore.playerName !== ''

    const joinGameModal = (
      <Modal visible={this.state.showJoinGameModal}>
        <View style={containerStyle}>
          <TextInput
            placeholder="Enter your name"
            value={appStore.playerName}
            onChange={value => appStore.updatePlayerName(value.nativeEvent.text)}
            placeholderTextColor={colors.grey}
            style={styles.titleInput}
          />
          <TextInput
            placeholder="Enter a room code"
            value={this.state.roomCodeInput}
            onChange={value => this.setState({ roomCodeInput: value.nativeEvent.text })}
            placeholderTextColor={colors.grey}
            style={styles.titleInput}
          />
          <Button
            color={validRoomCodeAndName ? colors.white : colors.grey}
            title="Join Room"
            onPress={validRoomCodeAndName ? () => this._joinGamePressed(this.state.roomCodeInput) : () => { }}
          />
          <Button
            color={colors.white}
            title="Cancel"
            onPress={() => {
              this.setState({ showJoinGameModal: false })
            }}
          />
        </View>
      </Modal>
    )

    return (
      <View style={containerStyle}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        {selectStoryModal}
        {joinGameModal}
        <ScrollView>
          <Text style={styles.appTitle}>Many Worlds</Text>
          <TouchableOpacity onPress={() => this._updateName()}>
            <Text style={styles.header}>Your name: {appStore.playerName}</Text>
            <Text
              style={{ color: colors.white, marginTop: -5, marginBottom: 10 }}
            >
              (tap to change)
            </Text>
          </TouchableOpacity>
          <HeroButton
            style={commonStyles.heroButtonMargins}
            title="Join a Room"
            onPress={() => this.setState({ showJoinGameModal: true })}
          />
          <Text style={styles.header}>Play a Story</Text>
          {featuredStories.map((story: Story, i) => (
            <StoryListItem
              key={i}
              style={styles.StoryListItemStyle}
              story={story}
              selected={false}
              onPress={this.selectStory.bind(this, story)}
            />
          ))}
          <Text style={styles.header}>My Stories</Text>
          {myStories.map((story: Story, i) => (
            <Swipeout
              backgroundColor={colors.black}
              key={i}
              right={[
                {
                  text: "Delete",
                  onPress: this._deleteStory.bind(this, story),
                  backgroundColor: "#FE3A2F"
                }
              ]}
            >
              <StoryListItem
                story={story}
                selected={false}
                style={styles.StoryListItemStyle}
                onPress={this.selectStory.bind(this, story)}
              />
            </Swipeout>
          ))}
          <HeroButton
            style={{ marginBottom: 5 }}
            title="Create a Story"
            onPress={() => appStore.enterStoryBuilder()}
          />
          <Text style={styles.header}>News</Text>
          {NewsItems.map((item, key) => <NewsItem {...item} key={key} />)}
        </ScrollView>
      </View>
    )
  }
}

const styles: { [key: string]: ViewStyle | TextStyle | ImageStyle } = {
  appTitle: {
    fontSize: 48,
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15
  },
  header: {
    fontSize: 24,
    color: colors.white,
    marginTop: 15,
    marginBottom: 5
  },
  promptText: {
    fontSize: 24,
    color: colors.grey
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  titleInput: {
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 36,
    color: colors.white,
    justifyContent: "flex-start"
  },
  nameInput: {
    height: 20,
    fontSize: 18,
    color: colors.white
  },
  currentPromptText: {
    fontSize: 24,
    color: colors.white,
    textAlign: "left"
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
  },
  StoryListItemStyle: {
    marginBottom: 15
  }
}
