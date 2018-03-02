import { dbInstance } from "./firebaseRef"
import { Alert, AsyncStorage, AlertIOS } from "react-native"
import { StoryAction, StoryState, Story } from "./types/Story"
import { Player, playerDefaultState } from "./types/Player"
import { RoomState } from "./types/Network"
import { uuidv4, usernameStorageKey } from "./utils";
import { appStore } from "./stores/AppStore";

const dummySelectedStoryID = "820ebcfa-547e-4809-93c8-ad7008d782a8"

export const roomDefaultState: RoomState = {
  status: "pregame",
  currentStoryIndex: 0,
  storyID: dummySelectedStoryID,
  connectedPlayers: [],
  storyState: {},
  history: []
}

export const joinRoom = (roomCode: string, username: string) =>
  new Promise<string>((resolve, reject) => {
    dbInstance.ref(`/rooms/${roomCode}/`).once("value", snapshot => {
      const currentRoomState: RoomState = snapshot.val()

      if (currentRoomState === null) {
        Alert.alert(
          "Room not found. Does it exist, and did you enter the code correctly?"
        )
        return
      }

      if (username === "") {
        AlertIOS.prompt("What is your name?", undefined, (nameInput: string) => {
          username = nameInput
          appStore.updatePlayerName(nameInput)
          AsyncStorage.setItem(usernameStorageKey, nameInput)
        })
        return
      }

      const newPlayer = playerDefaultState
      newPlayer.name = username

      const id = uuidv4()
      newPlayer.id = id
      appStore.selfID = id

      const newRoomState = currentRoomState
      newRoomState.connectedPlayers.push(newPlayer)

      updateRoomState(roomCode, newRoomState)
        .then(() => {
          resolve(currentRoomState.storyID)
        })
        .catch(err => {
          reject(err)
        })
    })
  })

export const createRoom = (username: string, story: Story) =>
  new Promise<string>((resolve, reject) => {
    let code: number = 0
    code = Math.floor(Math.random() * 9999 - 1000) + 1000

    const initialRoomState = roomDefaultState

    const newPlayer = playerDefaultState
    newPlayer.name = username

    const id = uuidv4()
    newPlayer.id = id
    appStore.selfID = id

    roomDefaultState.connectedPlayers.push(newPlayer)
    roomDefaultState.storyState = story.defaultState

    dbInstance
      .ref(`/rooms/${code}/`)
      .set(initialRoomState)
      .then(() => {
        resolve(code.toString())
      })
  })

// update the remote state of the room
export function updateRoomState(roomCode: string, newState: RoomState) {
  return dbInstance.ref(`/rooms/${roomCode}`).update(newState)
}

export const getSelf = (players: Player[]): Player | undefined => {
  const self = players.find((p) => p.id === appStore.selfID)
  if (self) {
    return self
  }
  return undefined
}