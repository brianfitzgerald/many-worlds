import { dbInstance } from "./firebaseRef";
import { Alert } from "react-native";
import { Dispatch } from "redux";
import { StoryAction, StoryState } from "./types/Story";
import { Player } from "./types/Player";
import { RoomState } from "./types/Network";

export const defaultRoomState: RoomState = {
    currentStoryIndex: 0,
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

// update the remote state of the room
export function updateStoryState(roomID: string, newState: RoomState) {
    const newRoom =  dbInstance.ref(`/rooms/${roomID}`).update(newState)
}
