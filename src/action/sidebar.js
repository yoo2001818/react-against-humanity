import { createAction } from 'redux-actions';

export const CLOSE = 'sidebar/close';
export const OPEN = 'sidebar/open';
export const TOGGLE = 'sidebar/toggle';

export const close = createAction(CLOSE);
export const open = createAction(OPEN);
export const toggle = createAction(TOGGLE);
