import { createStore, applyMiddleware } from 'redux';

/* eslint-disable no-unused-vars */

import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import connectorMiddleware from './middleware/connector';

import reducer from '../reducer';

let logger = createLogger();

export default function configureStore(initialState, connector) {
  const middlewares = applyMiddleware(
    thunkMiddleware,
    logger
    // connectorMiddleware(connector)
  );

  let createStoreWithMiddleware = middlewares(createStore);
  return createStoreWithMiddleware(reducer, initialState);
}
