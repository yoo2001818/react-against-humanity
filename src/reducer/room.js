import * as RoomActions from '../action/room';
import * as ConnectionActions from '../action/connection';

function updateList(state, id, data) {
  if (state.list[id] === undefined) {
    throw new Error(`Room ${id} is not available`);
  }
  return Object.assign({}, state, {
    list: Object.assign({}, state.list, {
      [id]: Object.assign({}, state.list[id], data)
    })
  });
}

export default function room(state = {
  // This is used for auto-incrementing. This automatically gets up though,
  // However, create action should explicitly set the room id.
  last: 1,
  list: {}
}, action) {
  const { list } = state;
  const { type, payload, meta, error } = action;
  if (error) return state;
  const room = state.list[meta.room];
  switch (type) {
  case RoomActions.CREATE:
    if (list[meta.room] !== undefined) {
      throw new Error(`Room ${meta.room} is already occupied`);
    }
    return Object.assign({}, state, {
      list: Object.assign({}, list, {
        [meta.room]: Object.assign({}, payload, {
          users: [meta.connection.id]
        })
      }),
      last: Math.max(state, meta.room) + 1
    });
  case RoomActions.DESTROY:
    if (list[meta.room] === undefined) {
      throw new Error(`Room ${meta.room} is not available`);
    }
    return Object.assign({}, state, {
      list: (() => {
        let newList = Object.assign({}, list);
        delete newList[meta.room];
        return newList;
      })()
    });
  case RoomActions.UPDATE:
    return updateList(state, meta.room, payload);
  case RoomActions.JOIN:
    if (meta.connection.room != null) {
      throw new Error('User has already connected to the room');
    }
    if (room.users.indexOf(meta.connection.id) !== -1) {
      throw new Error('User has already connected to the room');
    }
    return updateList(state, meta.room,
      Object.assign({}, room, {
        users: room.users.concat([meta.connection.id])
      })
    );
  case RoomActions.LEAVE:
  case ConnectionActions.DISCONNECT:
    break;
  case ConnectionActions.HANDSHAKE:
    return payload.room;
  }
  return state;
}
