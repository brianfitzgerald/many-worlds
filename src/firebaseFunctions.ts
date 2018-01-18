import { dbInstance } from "./firebaseRef";
import { Alert } from "react-native";
import { StoryAction, StoryState } from "./types/Story";
import { Player } from "./types/Player";
import { RoomState } from "./types/Network";

export const defaultRoomState: RoomState = {
    currentStoryIndex: 0,
    connectedPlayers: [],
    storyState: {},
    history: []
}


export const joinRoom = (roomCode: string, username: string) => new Promise<string>((resolve, reject) => {
    return dbInstance.ref(`/rooms/${roomCode}/`).once('value', (snapshot) => {

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

        dbInstance.ref(`/rooms/${roomCode}/players/${username}`).set(newPlayer).then(() => resolve())
    })
    .catch((error) => {
        reject(error)
    });
})


export const createRoom = (username: string) => new Promise<string>((resolve, reject) => {

    let code: number = 0
    code = Math.floor(Math.random() * 9999 - 1000) + 1000

    dbInstance.ref(`/rooms/${code}/`).set(defaultRoomState).then(() => {
        resolve(code.toString())
    })

})

// update the remote state of the room
export function updateStoryState(roomCode: string, newState: RoomState) {
    return dbInstance.ref(`/rooms/${roomCode}`).update(newState)
}
