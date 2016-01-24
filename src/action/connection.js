import { createAction } from 'redux-actions';

export const UPDATE = 'connection/update';
export const HANDSHAKE = 'connection/handshake';
export const CONNECT = 'connection/connect';
export const DISCONNECT = 'connection/disconnect';
export const LOGIN = 'connection/login';
export const LOGOUT = 'connection/logout';

// Updates the connection information; however this is too vague.
// This NEVER should be accepted by the server... However server can emit this
// for greater good, although creating a new action would be better.
export const update = createAction(UPDATE,
  connection => connection,
  connection => ({
    target: {
      connection: connection.id
    }
  })
);

// Handshake, initializes the connection.
export const handshake = createAction(HANDSHAKE,
  data => data,
  () => ({
    class: 'write'
  })
);

// Broadcasts the connection's connect event. This shouldn't be issued by the
// client, although server will just ignore it.
export const connect = createAction(CONNECT,
  connection => connection,
  connection => ({
    target: {
      connection: connection.id
    },
    class: 'write'
  })
);

// Broadcasts the connection's disconnect event. Clients can issue this to
// disconnect itself.
export const disconnect = createAction(DISCONNECT,
  data => data,
  (_, connection) => ({
    target: {
      connection: connection.id,
      // Do we really need this in here?
      room: connection.roomId
    },
    class: 'write'
  })
);

export const login = createAction(LOGIN,
  data => data,
  (_, connection) => ({
    target: {
      connection: connection.id
    }
  })
);

export const logout = createAction(LOGOUT,
  data => data,
  (_, connection) => ({
    target: {
      connection: connection.id
    }
  })
);
