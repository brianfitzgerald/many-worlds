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
  TouchableOpacity
} from "react-native"
import Swipeout from "react-native-swipeout"
import { observer } from "mobx-react"

import commonStyles from "../styles/commonStyles"
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
import { fetchFeaturedStoriesRequest, fetchMyStoriesRequest, getStory } from "../actions/StoryDB"
import StoryActionPromptInput from "../components/StoryActionInput"
import NewsItems from "../newsItems"
import { appStore } from "../stores/AppStore"
import { usernameStorageKey } from "../utils"

type StartPageProps = {}
type StartpageState = {
  myStories: Story[]
  showSelectStoryModal: boolean
  selectedStory?: Story
  playerName: string
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
      playerName: ""
    }
  }

  componentWillMount() {
    this._loadUsername()
  }

  _loadUsername() {
    AsyncStorage.getItem(usernameStorageKey)
      .then(value => {
        if (value !== null) {
          console.log(value)
          appStore.updatePlayerName(value)
          this.setState({ playerName: value })
        }
      })
      .catch(error => console.warn(error))
  }

  _updateUsername() {
    AsyncStorage.setItem(usernameStorageKey, appStore.playerName)
  }

  componentDidMount() {

    appStore.fetchStories()

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

  _joinGamePressed() {
    const { playerName } = appStore
    if (!playerName || playerName === "") {
      AlertIOS.prompt("What is your name?", undefined, (nameInput: string) => {
        appStore.updatePlayerName(nameInput)
        AsyncStorage.setItem(usernameStorageKey, nameInput)
        this._joinRoom(nameInput)
      })
    } else {
      this._joinRoom(playerName)
    }
  }

  _updateName() {
    AlertIOS.prompt("What is your name?", undefined, (nameInput: string) => {
      appStore.updatePlayerName(nameInput)
      AsyncStorage.setItem(usernameStorageKey, nameInput)
    })
  }

  _joinRoom(playerName: string) {
    AlertIOS.prompt("Enter a room code", undefined, roomCodeInput => {
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
    })
  }

  _createRoom(selectedStory: Story) {
    const { playerName } = appStore
    createRoom(playerName, selectedStory).then((roomCode: string) => {
      this._updateUsername()
      appStore.enterRoom(roomCode, selectedStory)
    })
  }

  _deleteStory() { }

  render() {
    if (appStore.myStories.state === "pending") {
      return (
        <View style={[commonStyles.container, styles.partyContainer]}>
          <Text style={styles.promptButton}>Loading...</Text>
        </View>
      )
    }

    const featuredStories = appStore.featuredStories.filter(
      story => story.published
    )
    const myStories = this.state.myStories

    const selectedStory = this.state.selectedStory || emptyStory

    return (
      <View style={[commonStyles.container, styles.partyContainer]}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        <Modal visible={this.state.showSelectStoryModal}>
          <View style={[commonStyles.container, styles.partyContainer]}>
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
                appStore.enterSingleplayer(this.state.selectedStory)
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
            onPress={this._joinGamePressed.bind(this)}
          />
          <Text style={styles.header}>Play a Story</Text>
          {featuredStories.map((story: Story, i) => (
            <StoryListItem
              key={i}
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
                  text: "Remove",
                  onPress: this._deleteStory.bind(this, story),
                  backgroundColor: "#FE3A2F"
                }
              ]}
            >
              <StoryListItem
                story={story}
                selected={false}
                onPress={this.selectStory.bind(this, story)}
              />
            </Swipeout>
          ))}
          <HeroButton
            style={{ marginBottom: 5, marginTop: 15 }}
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
  partyContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
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
}
