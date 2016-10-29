import { combineReducers } from "redux"
import { createReducer } from "redux-act"

import {
  spawn, dispose, move
} from './actions'

const INITIAL = {
  clowns: [],
}

const clowns = createReducer({
  [spawn]: (state, clown) => {
    return [ ...state, clown ]
  },
  [dispose]: (state, clown) => {
    return state.filter(item => item.id !== clown.id)
  },
  [move]: (state, clown) => {
    return state.map(item => {
      if (item.id === clown.id) {
        item.pos = clown.pos
      }
      return item
    })
  }
}, INITIAL.clowns)

export default combineReducers(
  { clowns }
)