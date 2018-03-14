import { StyleSheet, Platform, ViewStyle, TextStyle } from "react-native"

import colors from "./colors"

export const containerStyle: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  backgroundColor: colors.black,
  paddingTop: 25,
  paddingLeft: 15,
  paddingRight: 15,
  paddingBottom: 15
}

export const titleInput: TextStyle = {
  height: 50,
  fontSize: 36,
  color: colors.white,
  justifyContent: "flex-start"
}
