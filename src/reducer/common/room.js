import * as RoomActions from '../../action/room';
import * as ConnectionActions from '../../action/connection';

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
  let roomId = meta && meta.target && meta.target.room;
  let room = state.list[roomId];
  switch (type) {
  case RoomActions.CREATE:
    if (roomId == null) roomId = state.last;
    if (list[roomId] !== undefined) {
      throw new Error(`Room ${roomId} is already occupied`);
    }
    return Object.assign({}, state, {
      list: Object.assign({}, list, {
        [roomId]: Object.assign({}, payload, {
          id: roomId,
          users: [meta.target.connection]
        })
      }),
      last: Math.max(state.last, roomId) + 1
    });
  case RoomActions.DESTROY:
    if (list[roomId] === undefined) {
      throw new Error(`Room ${roomId} is not available`);
    }
    return Object.assign({}, state, {
      list: (() => {
        let newList = Object.assign({}, list);
        delete newList[roomId];
        return newList;
      })()
    });
  case RoomActions.UPDATE:
    return updateList(state, roomId, payload);
  case RoomActions.JOIN:
    roomId = payload.room;
    room = list[roomId];
    if (room.users.indexOf(meta.target.connection) !== -1) {
      throw new Error('User has already connected to the room');
    }
    return updateList(state, roomId,
      Object.assign({}, room, {
        users: room.users.concat([meta.target.connection])
      })
    );
  case RoomActions.LEAVE:
  case ConnectionActions.DISCONNECT:
    if (type == ConnectionActions.DISCONNECT && room == null) return state;
    if (room.users.indexOf(meta.target.connection) === -1) {
      throw new Error('User did not connect to the room');
    }
    if (room.users.length === 1) {
      return Object.assign({}, state, {
        list: (() => {
          let newList = Object.assign({}, list);
          delete newList[roomId];
          return newList;
        })()
      });
    }
    return updateList(state, roomId,
      Object.assign({}, room, {
        users: room.users.filter(id => id !== meta.target.connection)
      })
    );
  case ConnectionActions.HANDSHAKE:
    return payload.room;
  }
  return state;
}
