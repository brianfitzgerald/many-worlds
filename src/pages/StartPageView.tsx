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
  ImageStyle
} from "react-native"
import Swipeout from "react-native-swipeout"
import { observer } from "mobx-react"

import commonStyles from "../styles/commonStyles"
import HeroButton, { LightHeroButton, NewsItem } from "../components/HeroButton"
import colors from "../styles/colors"

import { dbInstance } from "../firebaseRef"
import { Story, StoryOption, StoryAction } from "../types/Story"
import { Player } from "../types/Player"
import {
  getNextActionIndex,
  doAction,
  getActionByIndex
} from "../actions/Story"
import { RoomState, FirebaseRoomState } from "../types/Network"
import { roomDefaultState, updateRoomState } from "../firebaseFunctions"
import StoryListItem from "../components/StoryListItem"
import { getFeaturedStories, getMyStories } from "../actions/StoryDB"
import StoryActionPromptInput from "../components/StoryActionInput"
import NewsItems from "../newsItems"
import { appStore } from "../stores/AppStore"

type StartPageProps = {}
type StartpageState = {
  featuredStories: Story[]
  myStories: Story[]
  storiesLoaded: boolean
  showSelectStoryModal: boolean
  selectedStory?: Story
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
      showSelectStoryModal: false
    }
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
          <HeroButton
            style={commonStyles.heroButtonMargins}
            title="Join a Game"
            onPress={() => {}}
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
            onPress={() => {}}
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
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
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
