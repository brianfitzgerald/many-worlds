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

import commonStyles from "../styles/commonStyles"
import colors from "../styles/colors"
import { Story } from "../types/Story"

type StoryListItemProps = {
  story: Story
  onPress: () => void
  selected: boolean
}

const StoryListItem: React.SFC<StoryListItemProps> = ({
  story,
  onPress,
  selected
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.ItemBase}>
        <Text style={styles.StoryName}>{story.name}</Text>
        <Text style={styles.StoryDescription}>{story.description}</Text>
        <Text style={styles.StoryDescription}>
          Average rating: {story.averageRating} / 10
        </Text>
      </View>
      {selected ? <Text style={{ color: colors.white }}>Selected</Text> : null}
    </TouchableOpacity>
  )
}

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  ItemBase: {
    flexDirection: "column",
    paddingTop: 5,
    padding: 15,
    minHeight: 50,
    marginBottom: 5,
    marginTop: 15,
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
