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


const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  textInput: {
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 24,
    width: 250,
    color: colors.white
  },
  heroButtonMargins: {},
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center"
  },
  bodyText: {
    fontSize: 18,
    color: colors.white
  },
  PlayerListContainer: {
    marginTop: 25,
    marginBottom: 25
  },
  PlayerListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    marginBottom: 25,
    backgroundColor: colors.white,
    borderRadius: 10,
    minWidth: 200
  },
  PlayerListAddon: {
    fontSize: 16,
    color: colors.black,
    paddingRight: 15
  },
  PlayerListName: {
    fontSize: 24,
    color: colors.black,
    paddingLeft: 15
  }
})

export default styles
