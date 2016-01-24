import { createStore, applyMiddleware, combineReducers } from 'redux';

import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import dateInjector from './middleware/dateInjector';

let logger = createLogger();
if (__SERVER__) logger = () => next => action => next(action);

export default function configureStore(initialState, appends = [], reducer) {
  const middlewares = applyMiddleware.apply(null, appends.concat([
    dateInjector,
    thunkMiddleware,
    logger
  ]));

  let createStoreWithMiddleware = middlewares(createStore);
  return createStoreWithMiddleware(combineReducers(reducer), initialState);
}
