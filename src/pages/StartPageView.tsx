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
  AlertIOS
} from "react-native"
import Swipeout from "react-native-swipeout"
import { observer } from "mobx-react"

import commonStyles from "../styles/commonStyles"
import HeroButton, { LightHeroButton, NewsItem } from "../components/HeroButton"
import colors from "../styles/colors"

import { joinRoom, createRoom, roomDefaultState } from "../firebaseFunctions"

import { dbInstance } from "../firebaseRef"
import { Story, StoryOption, StoryAction } from "../types/Story"
import { Player } from "../types/Player"
import {
  getNextActionIndex,
  doAction,
  getActionByIndex
} from "../actions/Story"
import { RoomState, FirebaseRoomState } from "../types/Network"
import StoryListItem from "../components/StoryListItem"
import { getFeaturedStories, getMyStories, getStory } from "../actions/StoryDB"
import StoryActionPromptInput from "../components/StoryActionInput"
import NewsItems from "../newsItems"
import { appStore } from "../stores/AppStore"
import { usernameStorageKey } from "../utils"

type StartPageProps = {}
type StartpageState = {
  featuredStories: Story[]
  myStories: Story[]
  storiesLoaded: boolean
  showSelectStoryModal: boolean
  selectedStory?: Story
  playerName: string
}

const userID = "Brian Fitzgerald"

@observer
export default class StartPageView extends React.Component<
  StartPageProps,
  StartpageState
> {
  constructor(props: StartPageProps) {
    super(props)
    this.state = {
      featuredStories: [],
      myStories: [],
      storiesLoaded: false,
      showSelectStoryModal: false,
      playerName: ""
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
    AsyncStorage.setItem(usernameStorageKey, appStore.playerName)
  }

  componentDidMount() {
    getFeaturedStories()
      .then(featuredStories => {
        this.setState({ featuredStories, storiesLoaded: true })
      })
      .catch(err => console.log(err))

    getMyStories(userID)
      .then(myStories => {
        this.setState({ myStories, storiesLoaded: true })
      })
      .catch(err => console.log(err))
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
    console.log(playerName)
    if (!playerName || playerName === "") {
      AlertIOS.prompt("What is your name?", undefined, (nameInput: string) => {
        appStore.updatePlayerName(nameInput)
        this._joinRoom(nameInput)
      })
    } else {
      this._joinRoom(playerName)
    }
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

  _createRoom(storyID: string) {
    const { playerName } = appStore
    const story = getStory(storyID).then((story: Story) => {
      createRoom(playerName, story).then((roomCode: string) => {
        this._updateUsername()
      })
    })
  }

  render() {
    if (!this.state.storiesLoaded) {
      return (
        <View style={[commonStyles.container, styles.partyContainer]}>
          <Text style={styles.promptButton}>Loading...</Text>
        </View>
      )
    }

    return (
      <View style={[commonStyles.container, styles.partyContainer]}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        <Modal visible={this.state.showSelectStoryModal}>
          {this.state.selectedStory ? (
            <View>
              <StoryListItem
                story={this.state.selectedStory}
                selected={false}
                onPress={() => {}}
              />
              <HeroButton
                title="Play this story with friends"
                onPress={() => {}}
              />
              <HeroButton
                title="Play this story by yourself"
                onPress={() => {}}
              />
              {this.state.selectedStory.author === userID ? (
                <HeroButton
                  title="Edit this story"
                  onPress={this.beginEditing.bind(
                    this,
                    this.state.selectedStory
                  )}
                />
              ) : null}
              <HeroButton
                title="Play this story by yourself"
                onPress={() =>
                  appStore.enterSingleplayer(this.state.selectedStory)
                }
              />
            </View>
          ) : null}
          <Button
            title="Cancel"
            onPress={() => {
              this.setState({ showSelectStoryModal: false })
            }}
          />
        </Modal>
        <ScrollView>
          <Text style={styles.appTitle}>Midnight Sun</Text>
          <Text style={styles.header}>Your name: {appStore.playerName}</Text>
          <HeroButton
            style={commonStyles.heroButtonMargins}
            title="Join a Game"
            onPress={this._joinGamePressed.bind(this)}
          />
          <Text style={styles.header}>News</Text>
          {NewsItems.map((item, key) => <NewsItem {...item} key={key} />)}
          <Text style={styles.header}>Featured Stories</Text>
          {this.state.featuredStories.map((story: Story, i) => (
            <StoryListItem
              key={i}
              story={story}
              selected={false}
              onPress={this.selectStory.bind(this, story)}
            />
          ))}
          <Text style={styles.header}>My Stories</Text>
          {this.state.myStories.map((story: Story, i) => (
            <StoryListItem
              key={i}
              story={story}
              selected={false}
              onPress={this.selectStory.bind(this, story)}
            />
          ))}
          <HeroButton
            style={commonStyles.heroButtonMargins}
            title="Create a Story"
            onPress={() => appStore.enterStoryBuilder()}
          />
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
