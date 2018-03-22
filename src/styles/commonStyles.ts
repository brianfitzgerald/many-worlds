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

export const storyStyles = StyleSheet.create({
  promptText: {
    fontSize: 24,
    color: colors.grey
  },
  currentPromptText: {
    fontSize: 24,
    color: colors.white,
  },
  partyContainer: {
    flex: 1,
    flexDirection: "column"
  },
  playersWhoSelectedOption: {
    fontSize: 18,
    color: "white"
  },
  titleText: {
    fontSize: 48,
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15
  },
  promptButton: {
    width: "100%",
    marginBottom: 12,
    marginTop: 4,
    paddingLeft: 5,
    paddingRight: 5
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 6,
    height: 50
  },
  timer: {
    flex: 2,
    color: colors.white,
    textAlign: "right",
    fontSize: 18
  },
  roomCode: {
    flex: 1,
    color: colors.white,
    textAlign: "center",
    fontSize: 20
  }
})
