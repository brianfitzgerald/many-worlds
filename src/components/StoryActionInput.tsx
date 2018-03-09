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
  TextInput,
  TextStyle
} from "react-native"
import * as React from "react"

import commonStyles from "../styles/commonStyles"
import colors from "../styles/colors"
import { Story } from "../types/Story"

type StoryActionInputProps = {
  value: string
  onChange: (text: string) => void
  hasFilter: boolean
  onFilterPressed?: () => void
  inputType: "prompt" | "option"
  suppressFilterIcon?: boolean
}

const StoryActionInput: React.SFC<StoryActionInputProps> = props => {
  const filterButton =
    props.suppressFilterIcon === true ? null : (
      <TouchableOpacity onPress={props.onFilterPressed}>
        <Text style={{ color: props.hasFilter ? colors.white : colors.grey }}>
          {props.hasFilter ? "Edit Filter" : "Add a Filter"}
        </Text>
      </TouchableOpacity>
    )

  const isPrompt = props.inputType === "prompt"

  let bodyStyle = isPrompt ? PromptButtonBaseStyle : OptionButtonBaseStyle
  let textStyle = isPrompt ? PromptButtonTextStyle : OptionButtonTextStyle

  let body = (
    <View style={bodyStyle}>
      <TextInput
        placeholder={isPrompt ? "Enter a prompt" : "Enter an option"}
        placeholderTextColor={colors.grey}
        value={props.value}
        onChange={event => props.onChange(event.nativeEvent.text)}
        style={textStyle}
        multiline={true}
      />
    </View>
  )

  return (
    <View>
      {filterButton}
      {body}
    </View>
  )
}

export const PromptButtonBaseStyle: ViewStyle = {
  flexDirection: "column",
  padding: 15,
  minHeight: 50,
  marginBottom: 15,
  paddingTop: 10,
  marginTop: 15,
  backgroundColor: colors.lightBlack,
  borderRadius: 10,
  minWidth: 320
}

export const OptionButtonBaseStyle: ViewStyle = {
  padding: 15,
  paddingTop: 5,
  paddingBottom: 10,
  marginBottom: 15,
  alignSelf: "flex-end",
  backgroundColor: colors.white,
  borderRadius: 10,
  minWidth: 200
}

export const PromptButtonTextStyle: TextStyle = {
  textAlign: "left",
  fontSize: 16,
  backgroundColor: "transparent",
  color: colors.white
}

export const OptionButtonTextStyle: TextStyle = {
  textAlign: "left",
  fontSize: 16,
  backgroundColor: "transparent",
  color: colors.black
}

export default StoryActionInput
