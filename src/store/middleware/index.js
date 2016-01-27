import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import stateInjector from './stateInjector';
import dateInjector from './dateInjector';

let logger = createLogger();
if (__SERVER__) logger = () => next => action => next(action);

export default [
  thunkMiddleware,
  dateInjector,
  stateInjector,
  logger
];
