import * as TransportActions from '../action/transport';
import * as RoomActions from '../action/room';
import * as ConnectionActions from '../action/connection';

function updateList(state, id, data) {
  if (state.list[id] === undefined) {
    throw new Error(`Connection ${id} is not available`);
  }
  return Object.assign({}, state, {
    list: Object.assign({}, state.list, {
      [id]: Object.assign({}, state.list[id], data)
    })
  });
}

export default function connection(state = {
  self: null,
  list: {}
}, action) {
  const { list } = state;
  const { type, payload, meta, error } = action;
  if (error) return state;
  switch (type) {
  case ConnectionActions.CONNECT:
    if (list[payload.id] !== undefined) {
      throw new Error(`Connection ${payload.id} is already occupied`);
    }
    return Object.assign({}, state, {
      list: Object.assign({}, list, {
        [payload.id]: payload
      })
    });
  case ConnectionActions.DISCONNECT:
    if (list[payload.id] === undefined) {
      throw new Error(`Connection ${payload.id} is not available`);
    }
    return Object.assign({}, state, {
      list: (() => {
        let newList = Object.assign({}, list);
        delete newList[payload.id];
        return newList;
      })()
    });
  case ConnectionActions.UPDATE:
    return updateList(state, payload.id, payload);
  case RoomActions.CREATE:
    if (list[meta.target.connection.id].room != null) {
      throw new Error('User has already connected to the room');
    }
    // Create MUST have 'meta.room' variable, it should be injected by
    // the server.
    if (meta.target.room == null) {
      throw new Error('meta.target.room is missing');
    }
    return updateList(state, meta.target.connection.id, {
      room: meta.target.room
    });
  case RoomActions.JOIN:
    if (list[meta.target.connection.id].room != null) {
      throw new Error('User has already connected to the room');
    }
    return updateList(state, meta.target.connection.id, {
      room: meta.target.room
    });
  case RoomActions.LEAVE:
    if (list[meta.target.connection.id].room == null) {
      throw new Error('User doesn\'t belong to any room');
    }
    return updateList(state, meta.target.connection.id, {
      room: null
    });
  case ConnectionActions.HANDSHAKE:
    return payload.connection;
  case TransportActions.CREATE:
    return Object.assign({}, state, {
      self: null
    });
  }
  return state;
}
