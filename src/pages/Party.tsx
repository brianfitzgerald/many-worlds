import * as React from 'react';
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

import Story, { Action, StoryOption } from '../Story'
import Player from '../Player'

import outOfTheSun from '../stories/outOfTheSun'

type PartyViewProps = {
    story: Story
    players: Player[],
    currentPlayerName: string
}

type PartyViewState = {
    currentAction: Action
}

export const getMe = (name: string, players: Player[]) => players.find((p) => p.name === name)

export default class PartyView extends React.Component<PartyViewProps, PartyViewState> {

    constructor(props: PartyViewProps) {

        super(props)

        this.state = {
            currentAction: this.props.story.getCurrentAction()
        }

    }

    playerSelectChoice(option: StoryOption) {
        this.props.story.doAction(option, this.props.players)
        this.props.story.goToNextAction()
        this.setState({
            currentAction: this.props.story.getCurrentAction()
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
                {this.props.story.history.map((p, i) => <Text key={i} style={styles.promptText}>{p}</Text>)}
                <Text style={styles.currentPromptText}>{currentAction.prompt}</Text>
            </ScrollView>
            {currentAction.options.map((a, i) =>
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
