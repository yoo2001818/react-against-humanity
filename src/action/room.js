import { createAction } from 'redux-actions';

export const JOIN = 'room/join';
export const LEAVE = 'room/leave';
export const CREATE = 'room/create';
export const DESTROY = 'room/destroy';

export const SET_NAME = 'room/setName';
export const INVITE = 'room/invite';
export const KICK = 'room/kick';

export const START = 'room/start';

export const join = createAction(JOIN);
export const leave = createAction(LEAVE);
export const create = createAction(CREATE);
export const destroy = createAction(DESTROY);

export const setName = createAction(SET_NAME);
export const invite = createAction(INVITE);
export const kick = createAction(KICK);

export const start = createAction(START);
