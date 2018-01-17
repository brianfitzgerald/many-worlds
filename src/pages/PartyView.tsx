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

import StoryObject, { Action, StoryOption } from '../Story'
import Player from '../Player'
import { dbInstance } from '../firebaseRef';
import { updateRoom, RoomState, updateStoryState, defaultRoomState } from '../firebaseFunctions';
import { connect, MapStateToProps } from 'react-redux';
import { IndexState } from '../reducers/Index';

type PartyViewProps = {
    story: StoryObject
    currentPlayerName: string
    roomID: string
    dispatch?: (func: ({ type: string; value: RoomState; })) => void
}

type PartyViewState = {
    currentStoryIndex: number,
    roomState: RoomState
}


export const getMe = (name: string, players: Player[]) => players.find((p) => p.name === name)

export default class PartyView extends React.Component<PartyViewProps, PartyViewState> {

    constructor(props: PartyViewProps) {

        super(props)

        this.state = {
            currentStoryIndex: 0,
            roomState: {
                connectedPlayers: [],
                storyState: {},
                history: []
            }
        }

    }

    componentDidMount() {
        const matchID = this.props.roomID
        dbInstance.ref(`/rooms/${matchID}/`).on('value', (snap) => {
            const updatedRoomState: RoomState = snap ? snap.val() as RoomState : defaultRoomState
            // this should be the only place where room state is updated
            this.setState({ roomState: updatedRoomState })
        })
    }

    playerSelectChoice(option: StoryOption) {
        const currentStoryIndex = this.state.currentStoryIndex
        const newState = this.props.story.doAction(this.state.roomState.storyState, currentStoryIndex, option, this.state.roomState.connectedPlayers)
        const nextStoryIndex = this.props.story.getNextActionIndex(this.state.roomState.storyState, currentStoryIndex)
        updateStoryState(this.props.roomID, newState, nextStoryIndex)
    }

    render() {

        console.log(this.props.story);
        if (!this.props.story) return <View />
        
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
