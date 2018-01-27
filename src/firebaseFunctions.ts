import { dbInstance } from "./firebaseRef";
import { Alert } from "react-native";
import { StoryAction, StoryState } from "./types/Story";
import { Player, playerDefaultState } from "./types/Player";
import { RoomState } from "./types/Network";

const dummySelectedStoryID = '1b0dc9d6-9480-4afd-bda4-eb18167b3ef2'

export const roomDefaultState: RoomState = {
    currentStoryIndex: 0,
    storyID: dummySelectedStoryID,
    connectedPlayers: [],
    storyState: {},
    history: []
}

export const joinRoom = (roomCode: string, username: string) => new Promise<string>((resolve, reject) => {
    dbInstance.ref(`/rooms/${roomCode}/`).once('value', (snapshot) => {

        const currentRoomState: RoomState = snapshot.val()

        if (currentRoomState === null) {
            Alert.alert('Room not found. Does it exist, and did you enter the code correctly?')
            return
        }

        const newPlayer = playerDefaultState
        newPlayer.name = username
        const newRoomState = currentRoomState
        newRoomState.connectedPlayers.push(newPlayer)

        updateRoomState(roomCode, newRoomState).then(() => {
            resolve(currentRoomState.storyID)
        }).catch((err) => {
            reject(err)
        })
    })
})


export const createRoom = (username: string) => new Promise<string>((resolve, reject) => {

    let code: number = 0
    code = Math.floor(Math.random() * 9999 - 1000) + 1000

    const initialRoomState = roomDefaultState

    const newPlayer = playerDefaultState
    newPlayer.name = username

    roomDefaultState.connectedPlayers.push(newPlayer)

    dbInstance.ref(`/rooms/${code}/`).set(initialRoomState).then(() => {
        resolve(code.toString())
    })

})

// update the remote state of the room
export function updateRoomState(roomCode: string, newState: RoomState) {
    return dbInstance.ref(`/rooms/${roomCode}`).update(newState)
}
