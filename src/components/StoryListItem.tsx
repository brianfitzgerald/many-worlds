import {
  Text,
  ScrollView,
  View,
  Button,
  TouchableOpacity,
  StyleProp,
  ViewProperties,
  ViewStyle,
  StyleSheet
} from "react-native"
import * as React from "react"

import colors from "../styles/colors"
import { Story } from "../types/Story"

type StoryListItemProps = {
  story: Story
  ownedByUser?: boolean
  onPress?: () => void
  selected?: boolean
  style?: ViewStyle
}

const StoryListItem: React.SFC<StoryListItemProps> = ({
  story,
  onPress,
  selected,
  ownedByUser,
  style
}) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.ItemBase, style]}>
        <Text style={styles.StoryName}>{story.title} {ownedByUser ? story.published ? "(Published)" : "(Unpublished)" : null}</Text>
        <Text style={styles.StoryDescription}>By {story.author}</Text>
        <Text style={styles.StoryDescription}>{story.description}</Text>
      </View>
      {selected ? <Text style={{ color: colors.white }}>Selected</Text> : null}
    </TouchableOpacity>
  )

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  ItemBase: {
    flexDirection: "column",
    paddingTop: 5,
    padding: 15,
    minHeight: 50,
    backgroundColor: colors.white,
    borderRadius: 10,
    minWidth: 300
  },
  StoryName: {
    textAlign: "left",
    fontSize: 24,
    backgroundColor: "transparent",
    color: colors.black
  },
  StoryDescription: {
    textAlign: "left",
    fontSize: 12,
    color: colors.black
  }
})

export default StoryListItem
