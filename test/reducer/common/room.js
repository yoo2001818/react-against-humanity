import expect from 'expect';
import { createStore } from 'redux';

import roomReducer from '../../../src/reducer/common/room';

import * as ConnectionActions from '../../../src/action/connection';
import * as RoomActions from '../../../src/action/room';

const testConnection = {
  id: 1,
  name: 'Joe',
  level: 'guest',
  lastCreated: undefined,
  lastUpdated: undefined
};

const testConnection2 = {
  id: 2,
  name: 'John',
  level: 'guest',
  lastCreated: undefined,
  lastUpdated: undefined
};

function injectUser(action, id = 1) {
  return Object.assign({}, action, {
    meta: Object.assign({}, action.meta, {
      target: Object.assign({}, action.meta && action.meta.target, {
        connection: id
      }),
      // Oh god why..
      state: { connection: { list: {
        1: testConnection,
        2: testConnection2
      }}}
    })
  });
}

function injectRoom(action, roomId = 1) {
  return Object.assign({}, action, {
    meta: Object.assign({}, action.meta, {
      target: Object.assign({}, action.meta && action.meta.target, {
        room: roomId
      })
    })
  });
}

describe('roomReducer', () => {
  let store;
  beforeEach('initialize store', () => {
    store = createStore(roomReducer);
  });
  describe('@/init', () => {
    it('should init with valid fields', () => {
      expect(store.getState()).toEqual({
        last: 1,
        list: {}
      });
    });
  });
  describe('@/create', () => {
    it('should create a room and add player', () => {
      store.dispatch(injectUser(RoomActions.create({
        name: 'Hello, world!'
      }, 1)));
      // Since room has so many fields, we'll only check mandatory fields.
      let room = store.getState().list[1];
      expect(room).toBeA(Object);
      expect(room.id).toBe(1);
      expect(room.name).toBe('Hello, world!');
      expect(room.host).toBe(1);
      expect(room.userCount).toBe(1);
      expect(room.users).toEqual([1]);
    });
    it('should set last value', () => {
      store.dispatch(injectUser(RoomActions.create({}, 1)));
      expect(store.getState().last).toBe(2);
      store.dispatch(injectUser(RoomActions.create({}, 30)));
      expect(store.getState().last).toBe(31);
    });
    it('should throw an error if exists', () => {
      store.dispatch(injectUser(RoomActions.create({}, 1)));
      expect(() => store.dispatch(injectUser(RoomActions.create({}, 1))))
        .toThrow();
    });
  });
  describe('@/destroy', () => {
    it('should destroy the room', () => {
      store.dispatch(injectUser(RoomActions.create({}, 1)));
      store.dispatch(RoomActions.destroy(1));
      expect(store.getState().list[1]).toBe(undefined);
    });
    it('should throw an error if not exists', () => {
      expect(() => store.dispatch(RoomActions.destroy(1))).toThrow();
    });
  });
  describe('@/update', () => {
    beforeEach('create room', () => {
      store.dispatch(injectUser(RoomActions.create({
        name: 'Hello, world!'
      }, 1)));
    });
    it('should update the room', () => {
      store.dispatch(RoomActions.update({
        general: 'this',
        colonel: 'that'
      }, 1));
      let room = store.getState().list[1];
      expect(room.general).toBe('this');
      expect(room.colonel).toBe('that');
    });
  });
  describe('@/transferHost', () => {
    beforeEach('create room', () => {
      store.dispatch(injectUser(RoomActions.create({
        name: 'Hello, world!'
      }, 1)));
      store.dispatch(injectUser(RoomActions.join(1), 2));
    });
    it('should set the room host', () => {
      store.dispatch(injectUser(RoomActions.transferHost(2, 1), 1));
      let room = store.getState().list[1];
      expect(room.host).toBe(2);
    });
    it('should throw error if wrong connection is specified', () => {
      expect(() =>
        store.dispatch(injectUser(RoomActions.transferHost(3, 1), 1))
      )
        .toThrow();
    });
  });
  describe('@/join', () => {
    beforeEach('create room', () => {
      store.dispatch(injectUser(RoomActions.create({
        name: 'Hello, world!'
      }, 1)));
    });
    it('should add player to the room', () => {
      store.dispatch(injectUser(RoomActions.join(1), 2));
      let room = store.getState().list[1];
      expect(room.userCount).toBe(2);
      expect(room.users).toEqual([1, 2]);
    });
    it('should throw error if exists', () => {
      expect(() => store.dispatch(injectUser(RoomActions.join(1), 1)))
        .toThrow();
    });
  });
  // Various 'exit' tests... I don't get it.
  const LEAVE_TESTS = [
    {
      name: '@/leave',
      value: RoomActions.leave(1)
    },
    {
      name: 'connection/disconnect',
      value: ConnectionActions.disconnect({}, testConnection)
    },
    {
      name: 'connection/logout',
      value: ConnectionActions.logout(testConnection)
    },
    {
      name: '@/kick',
      value: RoomActions.kick(1)
    }
  ];
  for (let test of LEAVE_TESTS) {
    describe(test.name, () => {
      beforeEach('create room', () => {
        store.dispatch(injectUser(RoomActions.create({
          name: 'Hello, world!'
        }, 1)));
      });
      it('should remove player and change host', () => {
        store.dispatch(injectUser(RoomActions.join(1), 2));
        store.dispatch(injectUser(injectRoom(test.value), 1));
        let room = store.getState().list[1];
        expect(room.userCount).toBe(1);
        expect(room.users).toEqual([2]);
        expect(room.host).toEqual(2);
      });
      it('should remove room if nobody is left', () => {
        store.dispatch(injectUser(injectRoom(test.value), 1));
        expect(store.getState().list[1]).toBe(undefined);
      });
    });
  }
  // I think chat reducer related stuff should go to integration tests, so
  // I won't implement it here.
});
