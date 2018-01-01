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

import Story from '../Story'

import outOfTheSun from '../stories/outOfTheSun'

const pastPrompts = ["You see a chicken pecking by the road.", "You see some shriveled apple cores nearby."]
const prompt = "You see some goblins approaching. They look angry."

const choices = ["Run to the hills", "duck behind some bushes", "attempt to put on your invisibility cloak"]

export default class Party extends Component {

    constructor(props) {
        super(props)

        this.story = new Story(outOfTheSun.defaultState, outOfTheSun.actions)

        this.state = {
            currentAction: this.story.getCurrentAction()
        }
    }

    playerSelectChoice(action, prompt) {
        this.story.doAction(action, prompt)
        this.story.goToNextAction()
        this.setState({
            currentAction: this.story.getCurrentAction()
        })
    }

    render() {

        const currentAction = this.state.currentAction

        return (
            <View style={commonStyles.container}>
            <StatusBar
                backgroundColor={colors.black}
                barStyle="light-content"
            />
            <ScrollView>
                {this.story.history.map((p, i) => <Text key={i} style={styles.promptText}>{p}</Text>)}
                <Text style={styles.currentPromptText}>{currentAction.prompt}</Text>
            </ScrollView>
            {currentAction.actions.map((a, i) =>
                <HeroButton key={i} title={a.title} onPress={this.playerSelectChoice.bind(this, a)} style={styles.promptButton} />)}
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
