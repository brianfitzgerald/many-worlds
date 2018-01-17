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

import { dbInstance } from '../firebaseRef';
import { Story, StoryOption } from '../types/Story';
import { Player } from '../types/Player';
import { getNextActionIndex, doAction, getActionByIndex } from '../actions/Story';
import { RoomState, FirebaseRoomState } from '../types/Network';
import { defaultRoomState, updateStoryState } from '../firebaseFunctions';

type PartyViewProps = {
    story: Story
    currentPlayerName: string
    roomCode: string
    dispatch?: (func: ({ type: string; value: RoomState; })) => void
}

type PartyViewState = {
    roomState: RoomState
}

export default class PartyView extends React.Component<PartyViewProps, PartyViewState> {

    constructor(props: PartyViewProps) {

        super(props)

        this.state = {
            roomState: defaultRoomState
        }

    }

    componentDidMount() {
        const matchID = this.props.roomCode
        dbInstance.ref(`/rooms/${matchID}/`).on('value', (snap) => {
            const updatedRoomState: FirebaseRoomState = snap ? snap.val() as RoomState : defaultRoomState
            // this should be the only place where room state is updated
            const safeRoomState: RoomState = {
                currentStoryIndex: updatedRoomState.currentStoryIndex,
                connectedPlayers: updatedRoomState.connectedPlayers || [],
                storyState: updatedRoomState.storyState || {},
                history: updatedRoomState.history || [],
            }
            this.setState({ roomState: safeRoomState })
        })
    }

    playerSelectChoice(option: StoryOption) {
        const currentStoryIndex = this.state.roomState.currentStoryIndex
        const nextStoryIndex = getNextActionIndex(this.props.story, this.state.roomState.storyState, currentStoryIndex)
        const newState = doAction(this.state.roomState, this.props.story, currentStoryIndex, option)
        newState.currentStoryIndex = nextStoryIndex
        updateStoryState(this.props.roomCode, newState)
    }

    render() {        
        const currentAction = getActionByIndex(this.props.story, this.state.roomState.currentStoryIndex)

        return (
            <View style={commonStyles.container}>
            <StatusBar
                backgroundColor={colors.black}
                barStyle="light-content"
            />
            <ScrollView>
                {this.state.roomState.history.map((p, i) => <Text key={i} style={styles.promptText}>{p.prompt}</Text>)}
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
