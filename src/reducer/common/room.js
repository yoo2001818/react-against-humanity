import * as RoomActions from '../../action/room';
import * as ConnectionActions from '../../action/connection';

import chatFilter from './chatFilter';
import { getMap, addMap, updateOrRemoveMap } from './map';
import { addList, removeListEntry } from './list';
import gameplayReducer from './gameplay';

const chatReducer = chatFilter('room', [
  RoomActions.JOIN,
  RoomActions.LEAVE,
  RoomActions.CREATE,
  ConnectionActions.DISCONNECT,
  ConnectionActions.LOGOUT
]);

function handleLeave(state, connection) {
  // TODO We might want to look for the spectators too
  if (state.users.indexOf(connection) === -1) {
    throw new Error('User did not connect to the room');
  }
  if (state.userCount === 1) {
    // Just destroy the room if nobody will be in the room
    return null;
  }
  let host = state.host;
  if (state.host === connection) {
    // If exiting user is the host, set the host to user next to the host.
    const hostIndex = state.users.indexOf(connection);
    let nextHost = state.users[
      (hostIndex + 1) % state.users.length
    ];
    // Overwrite host information.
    host = nextHost;
  }
  return Object.assign(state, {
    users: removeListEntry(state.users, connection),
    userCount: state.userCount - 1,
    host
  });
}

export function roomEntry(state = {
  // Some default schema goes here
  spectators: [],
  users: [],
  userCount: 0,
  maxUserCount: 99,
  configuration: {
    decks: [],
    rules: []
  },
  playing: false,
  lockType: 'public'
}, action) {
  const { type, payload, error, meta } = action;
  if (error) return state;
  let updateState = Object.assign({}, state, {
    // Not gonna need this
    // lastUpdated: meta.date,
    chat: chatReducer(state.chat, action),
    gameplay: gameplayReducer(state, state.gameplay, action)
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
    return null;
  case RoomActions.UPDATE:
    return Object.assign(updateState, payload);
  case RoomActions.TRANSFER_HOST:
    if (updateState.users.indexOf(payload.id) === -1) {
      throw new Error('User did not connect to the room');
    }
    return Object.assign(updateState, {
      host: payload.id
    });
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
    return handleLeave(updateState, connection);
  case RoomActions.KICK:
    return handleLeave(updateState, payload.id);
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
  let id = meta && meta.target && meta.target.room;
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
  case RoomActions.DESTROY:
    id = payload && payload.id;
    return Object.assign({}, state, {
      list: updateOrRemoveMap(state.list, id, roomEntry(
        getMap(state.list, id), action
      ))
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
