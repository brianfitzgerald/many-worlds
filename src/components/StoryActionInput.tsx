import {
  Text,
  ScrollView,
  View,
  Button,
  TouchableOpacity,
  StyleProp,
  ViewProperties,
  ViewStyle,
  StyleSheet,
  TextInput
} from "react-native"
import * as React from "react"

import commonStyles from "../styles/commonStyles"
import colors from "../styles/colors"
import { Story } from "../types/Story"

type StoryActionInputProps = {
  value: string
  onChange: (text: string) => void
  placeholder?: string
}

const StoryActionPromptInput: React.SFC<StoryActionInputProps> = props => {
  return (
    <View style={styles.PromptBase}>
      <TextInput
        placeholder={props.placeholder}
        placeholderTextColor={colors.grey}
        value={props.value}
        onChange={event => props.onChange(event.nativeEvent.text)}
        style={styles.prompt}
      />
    </View>
  )
}

export const StoryActionOptionInput: React.SFC<
  StoryActionInputProps
> = props => {
  return (
    <View style={styles.OptionBase}>
      <TextInput
        placeholder={props.placeholder}
        placeholderTextColor={colors.grey}
        value={props.value}
        onChange={event => props.onChange(event.nativeEvent.text)}
        style={styles.option}
      />
    </View>
  )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  PromptBase: {
    flexDirection: "column",
    padding: 15,
    minHeight: 50,
    marginBottom: 15,
    marginTop: 15,
    backgroundColor: "#33333E",
    borderRadius: 10,
    minWidth: 320
  },
  OptionBase: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 15,
    alignSelf: "flex-end",
    backgroundColor: colors.white,
    borderRadius: 10,
    minWidth: 200
  },
  prompt: {
    textAlign: "left",
    fontSize: 16,
    backgroundColor: "transparent",
    color: colors.white
  },
  option: {
    textAlign: "left",
    fontSize: 16,
    backgroundColor: "transparent",
    color: colors.black
  },
  StoryDescription: {
    textAlign: "left",
    fontSize: 12,
    color: colors.black
  }
})

export default StoryActionPromptInput
