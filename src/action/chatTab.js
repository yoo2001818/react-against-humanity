import { createAction } from 'redux-actions';

export const CLOSE = 'chatTab/close';
export const OPEN = 'chatTab/open';
export const TOGGLE = 'chatTab/toggle';
export const SELECT = 'chatTab/select';

export const close = createAction(CLOSE);
export const open = createAction(OPEN);
export const toggle = createAction(TOGGLE);
export const select = createAction(SELECT);
