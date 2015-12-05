import { createAction } from 'redux-actions';

// Used to handle low-level open/close/error events.
// Reducers shouldn't handle this! However routers should handle it.
export const OPEN = 'transport/open';
export const CLOSE = 'transport/close';
export const ERROR = 'transport/error';

export const open = createAction(OPEN);
export const close = createAction(CLOSE);
export const error = createAction(ERROR);
