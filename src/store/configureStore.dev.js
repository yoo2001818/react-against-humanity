import { createStore, applyMiddleware, combineReducers, compose } from 'redux';

import DevTools from '../view/devTools';
import middlewareList from './middleware';

// Debug store init for __CLIENT__ && __DEVTOOLS__

export default function configureStore(initialState, appends = [], reducer) {
  const middlewares = applyMiddleware.apply(null,
    appends.concat(middlewareList)
  );

  let finalCreateStore = compose(
    middlewares,
    DevTools.instrument()
  )(createStore);
  const store = finalCreateStore(combineReducers(reducer), initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducer/client', () =>
      store.replaceReducer(combineReducers(
        require('../reducer/client').default
      ))
    );
  }

  return store;
}
