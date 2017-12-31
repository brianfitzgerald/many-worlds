import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
  View
} from 'react-native';
import commonStyles from '../styles/commonStyles';
import HeroButton from '../components/HeroButton';
import colors from '../styles/colors';

const pastPrompts = ["You see a chicken pecking by the road.", "You see some shriveled apple cores nearby."]
const prompt = "You see some goblins approaching. They look angry."

const choices = ["Run to the hills", "duck behind some bushes", "attempt to put on your invisibility cloak"]

export default class Party extends Component {
    playerSelectChoice() {
        
    }
    render() {
    return (
        <View style={commonStyles.container}>
        <StatusBar
            backgroundColor={colors.black}
            barStyle="light-content"
        />
        <ScrollView>
            {pastPrompts.map((p, i) => <Text key={i} style={styles.promptText}>{p}</Text>)}
            <Text style={styles.currentPromptText}>{prompt}</Text>
        </ScrollView>
        {choices.map((c, i) =>
            <HeroButton key={i} title={c} onPress={this.playerSelectChoice.bind(this, c)} style={styles.promptButton} />)}
        </View>
    );
    }
}

const styles = StyleSheet.create({
    promptText: {
        fontSize: 24,
        color: colors.grey
    },
    currentPromptText: {
        fontSize: 24,
        color: colors.white
    },
    promptButton: {
        width: '100%'
    }
});
