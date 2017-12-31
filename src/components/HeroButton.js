import {
    Text,
    ScrollView,
    View,
    Button,
    TouchableOpacity,
} from 'react-native'
import React, { Component } from 'react'

import commonStyles from '../styles/commonStyles'

const HeroButton = ({ title, onPress, style }) => {
    
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <View style={commonStyles.HeroButton}>
                <Text style={commonStyles.HeroButtonTitle}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default HeroButton