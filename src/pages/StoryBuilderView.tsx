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
  ViewStyle,
  TouchableOpacity,
  TextStyle
} from "react-native"
import Swipeout from "react-native-swipeout"

import commonStyles from "../styles/commonStyles"
import HeroButton, { LightHeroButton } from "../components/HeroButton"
import colors from "../styles/colors"

import { dbInstance } from "../firebaseRef"
import { Story, StoryOption, StoryAction, StoryState } from "../types/Story"
import { Player } from "../types/Player"
import {
  getNextActionIndex,
  doAction,
  getActionByIndex
} from "../actions/Story"
import { RoomState, FirebaseRoomState } from "../types/Network"
import { roomDefaultState, updateRoomState } from "../firebaseFunctions"
import StoryListItem from "../components/StoryListItem"
import { updateStory } from "../actions/StoryDB"
import StoryActionInput, {
  PromptButtonBaseStyle,
  PromptButtonTextStyle,
  OptionButtonBaseStyle,
  OptionButtonTextStyle
} from "../components/StoryActionInput"
import { appStore } from "../stores/AppStore"
import { buildStory } from "../actions/storyBuilder"

type StoryBuilderProps = {}

type StoryBuilderState = {
  hasMadeChanges: boolean
  story: Story
  filterModeActive: boolean
  filterModeTargetIndex: number
  filterPairs: FilterPair[]
}

export type FilterPair = {
  actionIndex: number
  optionIndex: number
  targetIndex: number
  filterBooleanValue: boolean
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
        published: false,
        actions: [],
        defaultState: {}
      },
      filterModeTargetIndex: 0,
      filterModeActive: false,
      filterPairs: [],
      hasMadeChanges: false
    }
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

  removeActionPrompt(actionIndex: number) {
    const newActions = this.state.story.actions
    newActions.splice(actionIndex, 1)
    this.setState({
      story: { ...this.state.story, actions: newActions }
    })
  }

  removeActionOption(actionIndex: number, optionIndex: number) {
    const newActions = this.state.story.actions
    newActions[actionIndex].options.splice(optionIndex, 1)
    this.setState({
      story: { ...this.state.story, actions: newActions }
    })
  }

  addOption(actionIndex: number) {
    const newOption: StoryOption = {
      title: "New option"
    }
    const newActions = this.state.story.actions
    newActions[actionIndex].options.push(newOption)
    this.setState({
      story: { ...this.state.story, actions: newActions },
      hasMadeChanges: true
    })
  }

  updateActionPrompt(actionIndex: number, value: string) {
    const newActions = this.state.story.actions
    newActions[actionIndex].prompt = value
    this.setState({ story: { ...this.state.story, actions: newActions } })
  }

  updateActionOption(actionIndex: number, optionIndex: number, value: string) {
    const newActions = this.state.story.actions
    newActions[actionIndex].options[optionIndex].title = value
    this.setState({ story: { ...this.state.story, actions: newActions } })
  }

  enterFilterMode(actionIndex: number, optionIndex: number) {
    if (!optionIndex) {
      this.setState({
        filterModeActive: true,
        filterModeTargetIndex: actionIndex
      })
    }
  }

  leaveFilterMode() {
    this.setState({ filterModeActive: false, filterModeTargetIndex: 0 })
  }

  publishStory() {
    updateStory(this.state.story, true).then(() => {
      alert("Your story is published!")
      appStore.leaveStoryBuilder()
    })
  }

  saveAndExit() {
    const builtStory = buildStory(this.state.story, this.state.filterPairs)
    if (this.state.hasMadeChanges) {
      updateStory(builtStory, false)
        .then(() => {
          appStore.leaveStoryBuilder()
        })
        .catch(err => console.log(err))
    } else {
      appStore.leaveStoryBuilder()
    }
  }

  testStory() {
    updateStory(this.state.story, false).then(() => {
      alert(
        "Your story is ready for testing. Go to My Stories on the main menu to play it."
      )
      appStore.enterSingleplayer(this.state.story)
    })
  }

  updateActionFilterSelection(
    actionIndex: number,
    optionIndex: number,
    targetIndex: number
  ) {
    const newFilterState = this.state.filterPairs
    const existingFilterIndex = newFilterState.findIndex(
      f =>
        f.optionIndex === optionIndex &&
        f.actionIndex === actionIndex &&
        f.targetIndex === targetIndex
    )

    if (existingFilterIndex === -1) {
      const newFilter: FilterPair = {
        actionIndex,
        optionIndex,
        targetIndex,
        filterBooleanValue: true
      }
      newFilterState.push(newFilter)
    } else if (existingFilterIndex !== -1) {
      const currentValue =
        newFilterState[existingFilterIndex].filterBooleanValue
      if (currentValue === false) {
        newFilterState.splice(existingFilterIndex, 1)
      } else {
        newFilterState[
          existingFilterIndex
        ].filterBooleanValue = !newFilterState[existingFilterIndex]
          .filterBooleanValue
      }
    }
    this.setState({ filterPairs: newFilterState })
  }

  render() {
    if (this.state.filterModeActive) {
      const targetIndex = this.state.filterModeTargetIndex
      const target = this.state.story.actions[targetIndex]
      const newFilter = this.state.filterPairs
      const validActionsToFilterBy = this.state.story.actions.filter(
        (a, i) => i !== targetIndex
      )
      return (
        <View style={[commonStyles.container, styles.partyContainer]}>
          <StatusBar backgroundColor={colors.black} barStyle="light-content" />
          <View style={styles.topBar}>
            <Button
              title="Done"
              color={colors.white}
              onPress={this.leaveFilterMode.bind(this)}
            />
          </View>
          <Text style={{ color: colors.white, textAlign: "left" }}>Target</Text>
          <StoryActionInput
            value={target.prompt}
            onChange={this.updateActionPrompt.bind(this, targetIndex)}
            hasFilter={
              target.filter !== undefined &&
              Object.keys(target.filter).length > 0
            }
            suppressFilterIcon={true}
            onFilterPressed={this.enterFilterMode.bind(this, targetIndex)}
            inputType="prompt"
          />
          <Text style={{ color: colors.white, textAlign: "left" }}>
            Filtering Options
          </Text>
          {validActionsToFilterBy.map((action, i) => (
            <View key={i}>
              <View style={PromptButtonBaseStyle}>
                <Text style={PromptButtonTextStyle}>{action.prompt}</Text>
              </View>
              {action.options
                ? action.options.map((action, k) => {
                    const isInFilter = newFilter.find(
                      f => f.optionIndex === k && f.actionIndex === i
                    )
                    return (
                      <View>
                        {isInFilter ? (
                          <Text style={FilterLabelStyle}>
                            {isInFilter.filterBooleanValue ? "True" : "False"}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          onPress={this.updateActionFilterSelection.bind(
                            this,
                            i,
                            k,
                            targetIndex
                          )}
                        >
                          <View style={OptionButtonBaseStyle}>
                            <Text style={OptionButtonTextStyle}>
                              {action.title}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                : null}
            </View>
          ))}
        </View>
      )
    }

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
                onPress={this.publishStory.bind(this)}
              />
            ) : null}
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Test"
              color={colors.white}
              onPress={this.testStory.bind(this)}
            />
          </View>
        </View>
        <ScrollView>
          <View style={{ flexDirection: "column", width: 320 }}>
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
            {this.state.story.actions.map((action, i) => (
              <View key={i}>
                <Swipeout
                  backgroundColor={colors.black}
                  right={[
                    {
                      text: "Remove",
                      onPress: this.removeActionPrompt.bind(this, i),
                      backgroundColor: "#FE3A2F"
                    }
                  ]}
                >
                  <StoryActionInput
                    value={action.prompt}
                    onChange={this.updateActionPrompt.bind(this, i)}
                    hasFilter={action.filter !== undefined}
                    onFilterPressed={this.enterFilterMode.bind(this, i, null)}
                    inputType="prompt"
                  />
                </Swipeout>
                {action.options
                  ? action.options.map((action, k) => (
                      <Swipeout
                        key={k}
                        backgroundColor={colors.black}
                        right={[
                          {
                            text: "Remove",
                            onPress: this.removeActionOption.bind(this, i, k),
                            backgroundColor: "#FE3A2F"
                          }
                        ]}
                      >
                        <StoryActionInput
                          value={action.title}
                          hasFilter={action.filter !== undefined}
                          onChange={this.updateActionOption.bind(this, i, k)}
                          suppressFilterIcon={true}
                          inputType="option"
                        />
                      </Swipeout>
                    ))
                  : null}
                <LightHeroButton
                  title="Add an option"
                  onPress={this.addOption.bind(this, i)}
                  style={{ minWidth: 100, alignSelf: "flex-end" }}
                />
              </View>
            ))}
          </View>
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

const FilterLabelStyle: TextStyle = {
  color: colors.blue
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
