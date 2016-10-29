import { createStore, applyMiddleware } from "redux"
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import logger from 'redux-logger'
import reducer from './reducers'
import saga from './sagas'

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    reducer, initialState, composeWithDevTools(applyMiddleware(
      sagaMiddleware, logger()
    ))
  )
  sagaMiddleware.run(saga)
  //__DEV__ && (window.store = store)
  return store
}