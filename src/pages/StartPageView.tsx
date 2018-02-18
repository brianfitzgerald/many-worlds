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
  TextInput
} from "react-native"
import Swipeout from "react-native-swipeout"

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
import { getAllStories } from "../actions/StoryDB"
import StoryActionPromptInput, {
  StoryActionOptionInput
} from "../components/StoryActionInput"
import NewsItems from "../newsItems"

type StartPageProps = {}
type StartpageState = {
  stories: Story[]
}

export default class StartPageView extends React.Component<
  StartPageProps,
  StartpageState
> {
  constructor(props: StartPageProps) {
    super(props)
    this.state = {
      stories: []
    }
  }

  componentDidMount() {
    getAllStories()
      .then(stories => {
        this.setState({ stories })
      })
      .catch(err => console.log(err))
  }

  selectStory(story: Story) {}

  render() {
    const featuredStories = this.state.stories
    const myStories = this.state.stories

    if (featuredStories.length < 1) {
      return (
        <View style={[commonStyles.container, styles.partyContainer]}>
          <Text style={styles.promptButton}>Loading...</Text>
        </View>
      )
    }

    return (
      <View style={[commonStyles.container, styles.partyContainer]}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
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
            <StoryListItem
              key={i}
              story={story}
              selected={false}
              onPress={this.selectStory.bind(this, story)}
            />
          ))}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 48,
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center"
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
})
