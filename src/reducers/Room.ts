import { RoomState } from "../types/Network";
import { defaultRoomState } from "../firebaseFunctions";


export const types = {
    UPDATE_ROOM: 'UPDATE_ROOM',
    JOIN_ROOM_SUCCESS: 'JOIN_ROOM_SUCCESS'
}

export type RoomAction = {
    type: string
    value?: RoomState
}

const Room = (state: RoomState = defaultRoomState, action: RoomAction) => {

    switch (action.type) {

        case types.UPDATE_ROOM:
            return {
                ...state,
                roomData: action.value
            }

        default:
            return state
    }
}

export default Room
