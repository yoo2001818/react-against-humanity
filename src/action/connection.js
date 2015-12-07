import { createAction } from 'redux-actions';

export const UPDATE = 'connection/update';
export const HANDSHAKE = 'connection/handshake';
export const CONNECT = 'connection/connect';
export const DISCONNECT = 'connection/disconnect';

// These are only used for testing.

export const update = createAction(UPDATE,
  connection => connection,
  connection => ({
    connection: connection.id
  })
);
export const handshake = createAction(HANDSHAKE,
  data => data,
  (_, connection) => ({
    connection: connection,
    class: 'write'
  })
);
export const connect = createAction(CONNECT,
  connection => connection,
  connection => ({
    connection: connection.id,
    class: 'write'
  })
);
export const disconnect = createAction(DISCONNECT,
  connection => connection,
  connection => ({
    connection: connection.id,
    class: 'write'
  })
);
