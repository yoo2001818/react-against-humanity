import { createStore, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import connectorMiddleware from './middleware/connector';
import unpackTarget from './middleware/unpackTarget';

import reducer from '../reducer';

let logger = createLogger();
if (__SERVER__) logger = () => next => action => next(action);

export default function configureStore(initialState, connector) {
  const middlewares = applyMiddleware(
    connectorMiddleware(connector),
    unpackTarget,
    thunkMiddleware,
    logger
  );

  let createStoreWithMiddleware = middlewares(createStore);
  return createStoreWithMiddleware(reducer, initialState);
}
