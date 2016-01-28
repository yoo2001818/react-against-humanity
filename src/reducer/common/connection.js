import * as TransportActions from '../../action/transport';
import * as RoomActions from '../../action/room';
import * as ConnectionActions from '../../action/connection';

import { getMap, updateMap, addMap } from './map';

export function connectionEntry(state = {
  id: null,
  name: null,
  level: 'anonymous'
}, action) {
  const { type, payload, error, meta } = action;
  if (error) return state;
  if (state.exited) {
    throw new Error('This connection has exited; it cannot be changed.');
  }
  let updateState = Object.assign({}, state, {
    lastUpdated: meta.date
  });
  switch (type) {
  case ConnectionActions.CONNECT:
    return Object.assign({}, updateState, {
      lastCreated: meta.date
    }, payload);
  case ConnectionActions.UPDATE:
    // Combine information with current status
    return Object.assign({}, updateState, payload);
  case ConnectionActions.LOGIN:
    if (updateState.level !== 'anonymous') {
      throw new Error('Already logged in');
    }
    return Object.assign({}, updateState, payload);
  case ConnectionActions.LOGOUT:
    if (updateState.level === 'anonymous') {
      throw new Error('Already logged out');
    }
    return Object.assign({}, updateState, {
      level: 'anonymous'
    });
  case ConnectionActions.DISCONNECT:
    return Object.assign({}, updateState, {
      exited: true
    });
  case RoomActions.CREATE:
  case RoomActions.JOIN:
    if (state.roomId != null) {
      throw new Error('Connection has already connected to the room');
    }
    // Create and join MUST have 'meta.room' variable, it should be injected by
    // the server.
    if (meta.target.room == null) {
      throw new Error('meta.target.room is missing');
    }
    return Object.assign({}, updateState, {
      roomId: meta.target.room
    });
  case RoomActions.LEAVE:
    if (state.roomId == null) {
      throw new Error('Connection doesn\'t belong to any room');
    }
    return Object.assign({}, updateState, {
      roomId: null
    });
  }
  return updateState;
}

export default function connection(state = {
  self: null,
  list: {}
}, action) {
  const { type, payload, meta, error } = action;
  const id = meta && meta.target && meta.target.connection;
  if (error) return state;
  switch (type) {
  case ConnectionActions.CONNECT:
    return Object.assign({}, state, {
      list: addMap(state.list, id, connectionEntry(undefined, action))
    });
  case ConnectionActions.HANDSHAKE:
    return payload.connection;
  case TransportActions.CREATE:
    return Object.assign({}, state, {
      self: null
    });
  default:
    // Otherwise, pass everything to the connection entry reducer, if available.
    if (id == null) return state;
    return Object.assign({}, state, {
      list: updateMap(state.list, id, connectionEntry(
        getMap(state.list, id), action
      ))
    });
  }
  return state;
}
