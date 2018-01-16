import { combineReducers } from 'redux'

import room from './Room'
import { RoomState } from '../firebaseFunctions';

const indexReducer = combineReducers({ room })

export type IndexState = {
    roomState: RoomState
}

export default indexReducer
