import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import dateInjector from './dateInjector';

let logger = createLogger();
if (__SERVER__) logger = () => next => action => next(action);

export default [dateInjector,
  thunkMiddleware,
  logger
];
