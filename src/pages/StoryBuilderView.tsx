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
import { Story, StoryOption } from "../types/Story"
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

type StoryBuilderProps = {
  onCloseModal: () => {}
}

type StoryBuilderState = {
  hasMadeChanges: boolean
}

export default class StoryBuilderView extends React.Component<
  StoryBuilderProps,
  StoryBuilderState
> {
  constructor(props: StoryBuilderProps) {
    super(props)

    this.state = {
      hasMadeChanges: false
    }
  }

  saveAndExit() {
    this.props.onCloseModal()
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
        <View style={{ flexDirection: "column", width: 380 }}>
          <TextInput
            placeholder="Enter a title"
            placeholderTextColor={colors.grey}
            style={styles.titleInput}
          />
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor={colors.grey}
            style={styles.nameInput}
          />
        </View>
        <LightHeroButton
          title="Add your first action"
          onPress={() => {}}
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
