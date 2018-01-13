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

type PartyViewProps = {
    story: Story
    players: Player[],
    currentPlayerName: string
}

type PartyViewState = {
    currentStoryIndex: number
}

export const getMe = (name: string, players: Player[]) => players.find((p) => p.name === name)

export default class PartyView extends React.Component<PartyViewProps, PartyViewState> {

    constructor(props: PartyViewProps) {

        super(props)

        this.state = {
            currentStoryIndex: 0
        }

    }

    playerSelectChoice(option: StoryOption) {
        const currentStoryIndex = this.state.currentStoryIndex
        this.props.story.doAction(currentStoryIndex, option, this.props.players)
        const nextStoryIndex = this.props.story.getNextActionIndex(currentStoryIndex)
        this.setState({ currentStoryIndex: nextStoryIndex })
    }

    render() {

        const currentAction = this.props.story.getActionByIndex(this.state.currentStoryIndex)

        return (
            <View style={commonStyles.container}>
            <StatusBar
                backgroundColor={colors.black}
                barStyle="light-content"
            />
            <ScrollView>
                {this.props.story.history.map((p, i) => <Text key={i} style={styles.promptText}>{p.prompt}</Text>)}
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
        color: colors.white,
        textAlign: 'left'
    },
    promptButton: {
        width: '100%'
    }
});
