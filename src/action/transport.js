import { createAction } from 'redux-actions';

// Used to handle low-level open/close/error events.
// Reducers shouldn't handle this! However routers should handle it.
export const CREATE = 'transport/create';
export const OPEN = 'transport/open';
export const CLOSE = 'transport/close';
export const ERROR = 'transport/error';

export const create = createAction(CREATE);
export const open = createAction(OPEN);
export const close = createAction(CLOSE);
export const error = createAction(ERROR);

export const reconnect = createAction(CREATE, () => ({}), () => ({
  class: 'read'
}));

export const disconnect = createAction(CLOSE, () => ({}), () => ({
  class: 'read'
}));
