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
import { updateRoom, RoomState } from '../firebaseFunctions';
import { connect, MapStateToProps } from 'react-redux';
import { IndexState } from '../reducers/Index';

type PartyViewProps = {
    roomState?: RoomState
    story: StoryObject
    currentPlayerName: string
    matchID?: string
    dispatch?: (func: ({ type: string; value: RoomState; })) => void
}

type PartyViewState = {
    currentStoryIndex: number
}

const emptyRoomState: RoomState = {
    connectedPlayers: [],
    storyState: {},
    history: []
}

export const getMe = (name: string, players: Player[]) => players.find((p) => p.name === name)

class PartyView extends React.Component<PartyViewProps, PartyViewState> {

    constructor(props: PartyViewProps) {

        super(props)

        this.state = {
            currentStoryIndex: 0
        }

    }

    componentDidMount() {
        const matchID = this.props.matchID
        dbInstance.ref(`/rooms/${matchID}/`).on('value', (snap) => {
            const updatedRoomState: RoomState = snap ? snap.val() as RoomState : emptyRoomState
            if (this.props.dispatch) {
                this.props.dispatch(updateRoom(updatedRoomState))
            }
        })
    }

    playerSelectChoice(option: StoryOption) {
        if (this.props.roomState) {
            const currentStoryIndex = this.state.currentStoryIndex
            this.props.story.doAction(this.props.roomState.storyState, currentStoryIndex, option, this.props.roomState.connectedPlayers)
            const nextStoryIndex = this.props.story.getNextActionIndex(this.props.roomState.storyState, currentStoryIndex)
            this.setState({ currentStoryIndex: nextStoryIndex })
        }
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

interface PropsFromState {
    roomState: RoomState
}

const ConnectedPartyView: React.SFC<PropsFromState> = (state: IndexState, props: PartyViewProps) => (
    <PartyView roomState={state.roomState} {...props} />
)

const mapStateToProps = (state: any) => ({
    roomState: state.roomState
})

export default connect<PropsFromState, {}, PartyViewProps>(mapStateToProps)(ConnectedPartyView)

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
