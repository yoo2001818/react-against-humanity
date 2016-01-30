import * as RoomActions from '../../action/room';
import * as ConnectionActions from '../../action/connection';

import chatFilter from './chatFilter';
import { getMap, addMap, updateOrRemoveMap } from './map';
import { addList, removeListEntry } from './list';

const chatReducer = chatFilter('room', [
  RoomActions.JOIN,
  RoomActions.LEAVE,
  RoomActions.CREATE,
  ConnectionActions.DISCONNECT,
  ConnectionActions.LOGOUT
]);

export default function roomEntry(state = {
  // Some default schema goes here
  id: null,
  name: null,
  host: null,
  spectators: [],
  users: [],
  userCount: 0,
  // Of course this is a placeholder value..
  maxUserCount: 99,
  configuration: {
    decks: [],
    rules: []
  },
  playing: false,
  locked: false,
  password: null,
  chat: undefined
}, action) {
  const { type, payload, error, meta } = action;
  if (error) return state;
  let updateState = Object.assign({}, state, {
    // Not gonna need this
    // lastUpdated: meta.date,
    chat: chatReducer(state.chat, action)
  });
  const connection = meta.target.connection;
  switch (type) {
  case RoomActions.CREATE:
    return Object.assign(updateState, payload, {
      id: meta.target.room,
      host: connection,
      users: [connection],
      userCount: 1
    });
  case RoomActions.DESTROY:
    // TODO Note that connection side room unsetting is not done yet
    return null;
  case RoomActions.UPDATE:
    return Object.assign(updateState, payload);
  case RoomActions.JOIN:
    if (updateState.users.indexOf(connection) !== -1) {
      throw new Error('User has already connected to the room');
    }
    return Object.assign(updateState, {
      users: addList(updateState.users, connection),
      userCount: updateState.userCount + 1
    });
  case RoomActions.LEAVE:
  case ConnectionActions.DISCONNECT:
  // Logout isn't handled well yet
  case ConnectionActions.LOGOUT:
    // TODO We might want to look for the spectators too
    if (updateState.users.indexOf(connection) === -1) {
      throw new Error('User did not connect to the room');
    }
    if (updateState.userCount === 1) {
      // Just destroy the room if nobody will be in the room
      return null;
    }
    if (updateState.host === connection) {
      // If exiting user is the host, set the host to user next to the host.
      const hostIndex = updateState.users.indexOf(connection);
      let nextHost = updateState.users[
        (hostIndex + 1) % updateState.users.length
      ];
      // Overwrite host information.
      Object.assign(updateState, {
        host: nextHost
      });
    }
    return Object.assign(updateState, {
      users: removeListEntry(updateState.users, connection),
      userCount: updateState.userCount - 1
    });
  }
  return updateState;
}

export default function room(state = {
  // This is used for auto-incrementing. This automatically gets up though,
  // However, create action should explicitly set the room id.
  last: 1,
  list: {}
}, action) {
  const { type, payload, meta, error } = action;
  if (error) return state;
  const id = meta && meta.target && meta.target.room;
  switch (type) {
  case ConnectionActions.HANDSHAKE:
    return payload.room;
  case RoomActions.CREATE:
    // Don't automatically set this..
    // if (id == null) id = state.last;
    return Object.assign({}, state, {
      list: addMap(state.list, id, roomEntry(undefined, action)),
      last: Math.max(state.last, id + 1)
    });
  default:
    // Pass everything else to the room entry reducer
    if (id == null) return state;
    return Object.assign({}, state, {
      list: updateOrRemoveMap(state.list, id, roomEntry(
        getMap(state.list, id), action
      ))
    });
  }
  return state;
}
