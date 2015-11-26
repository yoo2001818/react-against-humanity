import { createAction } from 'redux-actions';

export const FETCH = 'session/fetch';

export const CONNECT = 'session/connect';
export const DISCONNECT = 'session/disconnect';

export const SIGN_OUT = 'session/signOut';
export const SIGN_IN = 'session/signIn';

export const fetch = createAction(FETCH);

export const connect = createAction(CONNECT);
export const disconnect = createAction(DISCONNECT);

export const signOut = createAction(SIGN_OUT);
export const signIn = createAction(SIGN_IN);
