import { dbInstance } from "./firebaseRef";
import { Alert } from "react-native";
import Player from "./Player";
import { StoryState, Action } from "./Story";
import { Dispatch } from "redux";
import { types } from './reducers/Room'

export type RoomState = {
    connectedPlayers: Player[]
    storyState: StoryState
    history: Action[]
}

export function joinRoom(matchID: string, username: string) {

    return (dispatch: any) => {
        return dbInstance.ref(`/rooms/${matchID}/`).once('value', (snapshot) => {
            const value = snapshot.val()
            if (value === null) {
                Alert.alert('Room not found. Does it exist, and did you enter the code correctly?')
                return
            }

            const newPlayerKey = value.players !== undefined ? Object.keys(value.players).length : 0

            dbInstance.ref(`/rooms/${matchID}/players/${username}`).set({
                role: '',
                name: username,
                ready: false,
                alive: true,
                switchedRole: '',
                accusedPlayer: '',
                actionUsed: false,
                playAgain: false,
                playerIndex: newPlayerKey
            }).then(() => {
                dispatch(joinRoomSuccess(matchID))
            })
        })
        .catch((error) => {
            console.log(error)
        });
    }

}

function joinRoomSuccess(matchID: string) {
    return {
        type: types.JOIN_ROOM_SUCCESS,
        matchID
    }
}


export function createRoom(username: string) {

    return (dispatch: Dispatch<string>) => {

        dbInstance.ref(`/rooms/`).once('value', (snapshot) => {
            let code: number = 0

            code = Math.floor(Math.random() * 9999 - 1000) + 1000

            dbInstance.ref(`/rooms/${code}/`).set({
                players: {},
                inProgress: true
            }).then(() => {
                dispatch(joinRoom(code.toString(), username))
            })

        })

    }

}

export function updateRoom(value: RoomState) {
    return {
        type: types.UPDATE_ROOM,
        value
    }
}
