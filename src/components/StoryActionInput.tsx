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

type StoryInputProps = {
  value: string
  onChange: (text: string) => void
  placeholder?: string
  hasFilter: boolean
  onFilterPressed?: () => void
  inputType: "prompt" | "option"
  suppressFilterIcon?: boolean
}

const StoryActionInput: React.SFC<StoryInputProps> = props => {
  const filterButton =
    props.suppressFilterIcon === true ? null : (
      <TouchableOpacity onPress={props.onFilterPressed}>
        <Text style={{ color: props.hasFilter ? colors.white : colors.grey }}>
          Filter
        </Text>
      </TouchableOpacity>
    )

  let body = null

  if (props.inputType === "prompt") {
    body = (
      <View style={PromptButtonBaseStyle}>
        <TextInput
          placeholder={props.placeholder}
          placeholderTextColor={colors.grey}
          value={props.value}
          onChange={event => props.onChange(event.nativeEvent.text)}
          style={PromptButtonTextStyle}
        />
      </View>
    )
  } else if (props.inputType === "option") {
    body = (
      <View style={OptionButtonBaseStyle}>
        <TextInput
          placeholder={props.placeholder}
          placeholderTextColor={colors.grey}
          value={props.value}
          onChange={event => props.onChange(event.nativeEvent.text)}
          style={OptionButtonTextStyle}
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

export const PromptButtonBaseStyle: ViewStyle = {
  flexDirection: "column",
  padding: 15,
  minHeight: 50,
  marginBottom: 15,
  marginTop: 15,
  backgroundColor: colors.lightBlack,
  borderRadius: 10,
  minWidth: 320
}

export const OptionButtonBaseStyle: ViewStyle = {
  padding: 15,
  paddingTop: 10,
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
