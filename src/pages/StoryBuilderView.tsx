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
import commonStyles from "../styles/commonStyles"
import HeroButton, { LightHeroButton } from "../components/HeroButton"
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

type StoryBuilderProps = {
  onCloseModal: () => {}
}

type StoryBuilderState = {
  hasMadeChanges: boolean
  story: Story
}

export default class StoryBuilderView extends React.Component<
  StoryBuilderProps,
  StoryBuilderState
> {
  constructor(props: StoryBuilderProps) {
    super(props)

    this.state = {
      story: {
        id: "",
        name: "",
        author: "",
        description: "",
        averageRating: 0,
        actions: [],
        defaultState: {}
      },
      hasMadeChanges: false
    }
  }

  saveAndExit() {
    this.props.onCloseModal()
  }

  setAuthor(value: any) {
    this.setState({
      story: { ...this.state.story, author: value },
      hasMadeChanges: true
    })
  }

  setTitle(value: any) {
    this.setState({
      story: { ...this.state.story, name: value },
      hasMadeChanges: true
    })
  }

  addAction() {
    const newAction: StoryAction = {
      prompt: "Add a prompt",
      options: []
    }
    const newActions = this.state.story.actions.concat(newAction)
    this.setState({
      story: { ...this.state.story, actions: newActions },
      hasMadeChanges: true
    })
  }

  addOption(actionIndex: number) {
    const newOption: StoryOption = {
      title: "New option"
    }
    const newActions = this.state.story.actions
    newActions[actionIndex].options.push(newOption)
    console.log(newActions)
    this.setState({
      story: { ...this.state.story, actions: newActions },
      hasMadeChanges: true
    })
  }

  updateActionPrompt(actionIndex: number, value: string) {
    console.log(value, actionIndex)
    const newActions = this.state.story.actions
    newActions[actionIndex].prompt = value
    this.setState({ story: { ...this.state.story, actions: newActions } })
  }

  updateActionOption(actionIndex: number, optionIndex: number, value: string) {
    const newActions = this.state.story.actions
    newActions[actionIndex].options[optionIndex].title = value
    this.setState({ story: { ...this.state.story, actions: newActions } })
  }

  render() {
    const hasMadeChanges = this.state.hasMadeChanges
    return (
      <View style={[commonStyles.container, styles.partyContainer]}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        <View style={styles.topBar}>
          <View style={{ flex: 2 }}>
            <Button
              title={hasMadeChanges ? "Save and Exit" : "Exit"}
              color={colors.white}
              onPress={this.saveAndExit.bind(this)}
            />
          </View>
          <View style={{ flex: 1 }}>
            {hasMadeChanges ? (
              <Button
                title="Publish"
                color={colors.white}
                onPress={this.saveAndExit.bind(this)}
              />
            ) : null}
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Test"
              color={colors.white}
              onPress={this.saveAndExit.bind(this)}
            />
          </View>
        </View>
        <ScrollView>
          <View style={{ flexDirection: "column", width: 300 }}>
            <TextInput
              placeholder="Enter a title"
              value={this.state.story.name || ""}
              onChange={this.setTitle.bind(this)}
              placeholderTextColor={colors.grey}
              style={styles.titleInput}
            />
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor={colors.grey}
              value={this.state.story.author || ""}
              onChange={this.setAuthor.bind(this)}
              style={styles.nameInput}
            />
          </View>
          {this.state.story.actions.map((action, i) => (
            <View key={i}>
              <StoryActionPromptInput
                value={action.prompt}
                onChange={this.updateActionPrompt.bind(this, i)}
              />
              {action.options
                ? action.options.map((action, k) => (
                    <StoryActionOptionInput
                      key={k}
                      value={action.title}
                      onChange={this.updateActionOption.bind(this, i, k)}
                    />
                  ))
                : null}
              <LightHeroButton
                title="Add an option"
                onPress={this.addOption.bind(this, i)}
                style={{ minWidth: 100, alignSelf: "flex-end" }}
              />
            </View>
          ))}
        </ScrollView>
        <LightHeroButton
          title={
            this.state.story.actions.length > 0
              ? "Add another action"
              : "Add your first action"
          }
          onPress={this.addAction.bind(this)}
          style={{ minWidth: 350 }}
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
