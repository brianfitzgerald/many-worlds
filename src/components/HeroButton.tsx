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

type HeroButtonProps = {
  title: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export const HeroButton: React.SFC<HeroButtonProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <View style={styles.HeroButton}>
        <Text style={styles.HeroButtonTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export const LightHeroButton: React.SFC<HeroButtonProps> = ({
  title,
  onPress,
  style
}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <View style={[styles.HeroButton, styles.LightHeroButton]}>
        <Text style={[styles.HeroButtonTitle, styles.LightHeroButtonTitle]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export type NewsItemProps = {
  contents: string
}

export const NewsItem: React.SFC<{ contents: string }> = ({ contents }) => (
  <View
    style={[
      styles.HeroButton,
      { backgroundColor: "#33333E", paddingTop: 10, paddingBottom: 10 }
    ]}
  >
    <Text style={[styles.HeroButtonTitle, styles.LightHeroButtonTitle]}>
      {contents}
    </Text>
  </View>
)

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  HeroButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
    backgroundColor: colors.white,
    borderRadius: 10,
    minWidth: 200,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  LightHeroButton: {
    backgroundColor: "#33333E",
    maxWidth: 320,
    marginLeft: 15
  },
  HeroButtonTitle: {
    textAlign: "center",
    fontSize: 24,
    color: colors.black
  },
  LightHeroButtonTitle: {
    color: colors.white,
    fontSize: 16
  }
})

export default HeroButton
