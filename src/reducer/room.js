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

// This is a test data, used for creating the view.
// Of course this shouldn't be present in production.
const testData = {
  1: {
    id: 1,
    name: '신비한 방',
    host: '인클',
    playerCount: 2,
    maxPlayerCount: 8
  },
  2: {
    id: 2,
    name: '초보만 오세요',
    host: '포풍초보',
    playing: true,
    playerCount: 3,
    maxPlayerCount: 6
  },
  3: {
    id: 3,
    name: '고라니 먹고싶다',
    host: '눉송이',
    playing: true,
    playerCount: 4,
    maxPlayerCount: 8
  },
  4: {
    id: 4,
    name: '매너플레이합시다',
    host: '쪼리핑',
    playerCount: 53,
    maxPlayerCount: 53
  },
  5: {
    id: 5,
    name: 'sdbx',
    locked: true,
    host: '탄라로',
    playerCount: 3,
    maxPlayerCount: 3
  }
};

export default function room(state = {
  // This is used for auto-incrementing. This automatically gets up though,
  // However, create action should explicitly set the room id.
  last: 6,
  list: testData
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
          users: [meta.target.connection.id]
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
    if (room.users.indexOf(meta.target.connection.id) !== -1) {
      throw new Error('User has already connected to the room');
    }
    return updateList(state, roomId,
      Object.assign({}, room, {
        users: room.users.concat([meta.target.connection.id])
      })
    );
  case RoomActions.LEAVE:
  case ConnectionActions.DISCONNECT:
    if (type == ConnectionActions.DISCONNECT && room == null) return state;
    if (room.users.indexOf(meta.target.connection.id) === -1) {
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
        users: room.users.filter(id => id !== meta.target.connection.id)
      })
    );
  case ConnectionActions.HANDSHAKE:
    return payload.room;
  }
  return state;
}
