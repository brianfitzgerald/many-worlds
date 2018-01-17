import {
    Text,
    ScrollView,
    View,
    Button,
    TouchableOpacity,
    StyleProp,
    ViewProperties,
    ViewStyle,
} from 'react-native'
import * as React from 'react'

import commonStyles from '../styles/commonStyles'

type HeroButtonProps = {
    title: string
    onPress: () => void
    style?: StyleProp<ViewStyle>
}

const HeroButton: React.SFC<HeroButtonProps> = ({ title, onPress, style }) => {
    
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <View style={commonStyles.HeroButton}>
                <Text style={commonStyles.HeroButtonTitle}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default HeroButton