import { createStore, applyMiddleware, combineReducers } from 'redux';

import middlewareList from './middleware';

export default function configureStore(initialState, appends = [], reducer) {
  const middlewares = applyMiddleware.apply(null,
    appends.concat(middlewareList)
  );

  let createStoreWithMiddleware = middlewares(createStore);
  return createStoreWithMiddleware(combineReducers(reducer), initialState);
}
