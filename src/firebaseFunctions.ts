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

export const defaultRoomState: RoomState = {
    connectedPlayers: [],
    storyState: {},
    history: []
}


export const joinRoom = (matchID: string, username: string) => new Promise((resolve, reject) => {
    return dbInstance.ref(`/rooms/${matchID}/`).once('value', (snapshot) => {

        const value = snapshot.val()

        if (value === null) {
            Alert.alert('Room not found. Does it exist, and did you enter the code correctly?')
            return
        }

        const newPlayerKey = value.players !== undefined ? Object.keys(value.players).length : 0
        
        const newPlayer: Player = {
            name: username,
            conditions: [],
            inventory: [],
            abilities: []
        }

        dbInstance.ref(`/rooms/${matchID}/players/${username}`).set(newPlayer).then(() => resolve())
    })
    .catch((error) => {
        reject(error)
    });
})


export function createRoom(username: string) {

    let code: number = 0
    code = Math.floor(Math.random() * 9999 - 1000) + 1000

    dbInstance.ref(`/rooms/${code}/`).set(defaultRoomState).then(() => {})

}

export function updateRoom(value: RoomState) {
    return {
        type: types.UPDATE_ROOM,
        value
    }
}


export function updateStoryState(roomID: string, newState: StoryState, newActionIndex: number) {
    dbInstance.ref(`/rooms/${roomID}`).update({
        actionUsed: true
    })
}
