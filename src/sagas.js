import io from "socket.io-client"
import { eventChannel } from "redux-saga"
import { fork, take, call, put, cancel } from "redux-saga/effects"
import {
  spawn, dispose, update, login, logout,
} from './actions'

const connect = (deviceId, radius = 500) => {
  return new Promise((resolve, reject) => {
    const socket = io("http://localhost:4000")
    socket.on('connect', () => {
      resolve(socket)
    })
    socket.on("error", reject)
  })
}

const subscribe = socket => {
  return eventChannel(emit => {
    socket.on('spawn', clown => {
      emit(spawn(clown))
    })
    socket.on('dispose', clown => {
      emit(dispose(clown))
    })
    socket.on('update', clown => {
      emit(update(clown))
    })
    socket.on('disconnect', e => {
      // TODO: handle
      e=null
    })
    return () => {}
  })
}

function* read(socket) {
  const channel = yield call(subscribe, socket)
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}

function* sendUpdate(socket) {
  while (true) {
    const { payload:clown } = yield take(`${update}`)
    socket.emit('update', clown)
  }
}

function* handleIO(socket) {
  yield fork(read, socket)
  yield fork(sendUpdate, socket)
}

function* flow() {
  while (true) {
    //let { payload } = yield take(`${login}`)
    const socket = yield call(connect)
    socket.emit('spawn', { device_uid: 1, position: [1,1] })

    const task = yield fork(handleIO, socket)

    yield take(`${logout}`)
    yield cancel(task)
    socket.emit('logout')
  }
}

export default function* rootSaga() {
  yield fork(flow)
}