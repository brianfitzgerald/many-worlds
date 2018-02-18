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

type InputType = "prompt" | "option"

type StoryInputProps = {
  value: string
  onChange: (text: string) => void
  placeholder?: string
  hasFilter: boolean
  onFilterPressed?: () => void
  inputType: InputType
  suppressFilterIcon?: boolean
}

const StoryActionInput: React.SFC<StoryInputProps> = props => {
  const filterButton =
    props.suppressFilterIcon === true ? null : (
      <TouchableOpacity onPress={props.onFilterPressed}>
        <Text style={{ color: props.hasFilter ? colors.white : colors.grey }}>
          FF
        </Text>
      </TouchableOpacity>
    )

  let body = null

  if (props.inputType === "prompt") {
    body = (
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
  } else if (props.inputType === "option") {
    body = (
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

  return (
    <View>
      {filterButton}
      {body}
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

export default StoryActionInput
