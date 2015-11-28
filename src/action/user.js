import { createAction } from 'redux-actions';

export const FETCH = 'user/fetch';

export const HANDSHAKE = 'user/handshake';

export const CONNECT = 'user/connect';
export const DISCONNECT = 'user/disconnect';

export const SIGN_OUT = 'user/signOut';
export const SIGN_IN = 'user/signIn';

export const fetch = createAction(FETCH);

export const handshake = createAction(HANDSHAKE);

export const connect = createAction(CONNECT);
export const disconnect = createAction(DISCONNECT);

export const signOut = createAction(SIGN_OUT);
export const signIn = createAction(SIGN_IN);
