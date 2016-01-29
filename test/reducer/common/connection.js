import expect from 'expect';
import connectionReducer from '../../../src/reducer/common/connection';
import {
  update, handshake, connect, disconnect, login, logout
} from '../../../src/action/connection';
import {
  create, join, leave, destroy
} from '../../../src/action/room';
import { createStore } from 'redux';

const testConnection = {
  id: 1,
  name: 'Anonymous',
  level: 'anonymous',
  lastCreated: undefined,
  lastUpdated: undefined
};

const testConnection2 = {
  id: 2,
  name: 'Guest',
  level: 'guest',
  lastCreated: undefined,
  lastUpdated: undefined
};

function injectUser(action) {
  return Object.assign({}, action, {
    meta: Object.assign({}, action.meta, {
      target: Object.assign({}, action.meta && action.meta.target, {
        connection: 1
      })
    })
  });
}

function injectState(action, state) {
  return Object.assign({}, action, {
    meta: Object.assign({}, action.meta, {
      state
    })
  });
}

describe('connectionReducer', () => {
  let store;
  beforeEach('configure store', () => {
    store = createStore(connectionReducer);
  });

  describe('@/init', () => {
    it('should init with valid fields', () => {
      // We expect createStore already dispatched INIT action.
      expect(store.getState()).toEqual({
        self: null,
        list: {}
      });
    });
  });

  describe('@/connect', () => {
    beforeEach('connect user', () => {
      store.dispatch(connect(testConnection));
    });

    it('should add connection to the list', () => {
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: testConnection
        }
      });
    });

    it('should handle multiple connections', () => {
      store.dispatch(connect(testConnection2));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: testConnection,
          2: testConnection2
        }
      });
    });

    it('should throw an error if duplicated', () => {
      expect(() => {
        store.dispatch(connect(testConnection));
      }).toThrow();
    });

    it('should ignore errored actions', () => {
      store.dispatch(Object.assign({}, connect(testConnection2), {
        error: true
      }));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: testConnection
        }
      });
    });
  });

  describe('@/disconnect', () => {
    beforeEach('connect user', () => {
      store.dispatch(connect(testConnection));
    });

    it('should remove connection from the list', () => {
      store.dispatch(disconnect(null, testConnection));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: Object.assign({}, testConnection, {
            exited: true
          })
        }
      });
    });

    it('should set roomId to null', () => {
      store.dispatch(injectUser(create({}, 1)));
      store.dispatch(disconnect(null, testConnection));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: Object.assign({}, testConnection, {
            exited: true,
            roomId: null
          })
        }
      });
    });

    it('should handle multiple connections', () => {
      store.dispatch(connect(testConnection2));

      store.dispatch(disconnect(null, testConnection));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: Object.assign({}, testConnection, {
            exited: true
          }),
          2: testConnection2
        }
      });

      store.dispatch(disconnect(null, testConnection2));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: Object.assign({}, testConnection, {
            exited: true
          }),
          2: Object.assign({}, testConnection2, {
            exited: true
          })
        }
      });
    });

    it('should throw an error if not exists', () => {
      store.dispatch(disconnect(null, testConnection));
      expect(() => {
        store.dispatch(disconnect(null, testConnection));
      }).toThrow();
    });

    it('should ignore errored actions', () => {
      store.dispatch(Object.assign({}, disconnect(null, testConnection), {
        error: true
      }));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: testConnection
        }
      });
    });
  });

  describe('@/update', () => {
    beforeEach('connect user', () => {
      store.dispatch(connect(testConnection));
    });

    it('should update connection', () => {
      store.dispatch(update({
        id: 1,
        name: 'So Awesome',
        // Test arbitrary fields too
        coolnessModifier: 0.2
      }));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: {
            id: 1,
            name: 'So Awesome',
            level: 'anonymous',
            coolnessModifier: 0.2,
            lastUpdated: undefined,
            lastCreated: undefined
          }
        }
      });
    });

    it('should throw an error if not exists', () => {
      store.dispatch(disconnect(null, testConnection));
      expect(() => {
        store.dispatch(update(testConnection));
      }).toThrow();
    });

    it('should ignore errored actions', () => {
      store.dispatch(Object.assign({}, update({
        id: 1,
        name: 'Hello'
      }), {
        error: true
      }));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: testConnection
        }
      });
    });
  });

  describe('@/login', () => {
    beforeEach('connect user', () => {
      store.dispatch(connect(testConnection));
    });
    it('should update connection', () => {
      store.dispatch(login({
        id: 1,
        level: 'user',
        name: 'Hello',
        userId: 32
      }));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: {
            id: 1,
            level: 'user',
            name: 'Hello',
            userId: 32,
            lastUpdated: undefined,
            lastCreated: undefined
          }
        }
      });
    });
    it('should throw error if already logged in', () => {
      store.dispatch(login({
        id: 1,
        level: 'user',
        name: 'Hello',
        userId: 32
      }));
      expect(() => store.dispatch(login({
        id: 1,
        level: 'user',
        name: 'Hello',
        userId: 32
      }))).toThrow();
    });
  });

  describe('@/logout', () => {
    beforeEach('connect user', () => {
      store.dispatch(connect(testConnection));
      store.dispatch(login({
        id: 1,
        level: 'guest',
        name: 'Hey'
      }));
    });
    it('should set level to anonymous', () => {
      store.dispatch(logout({
        id: 1
      }));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: {
            id: 1,
            level: 'anonymous',
            name: 'Hey',
            lastUpdated: undefined,
            lastCreated: undefined
          }
        }
      });
    });
    it('should throw error if already logged out', () => {
      store.dispatch(logout({ id: 1 }));
      expect(() => store.dispatch(logout({ id: 1 }))).toThrow();
    });
    it('should set roomId to null', () => {
      store.dispatch(injectUser(create({}, 1)));
      store.dispatch(logout({
        id: 1
      }));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: {
            id: 1,
            level: 'anonymous',
            name: 'Hey',
            lastUpdated: undefined,
            lastCreated: undefined,
            roomId: null
          }
        }
      });
    });
  });

  describe('room/create', () => {
    beforeEach('connect user', () => {
      store.dispatch(connect(testConnection));
    });
    it('should set the roomId to provided value', () => {
      // We don't need template for this
      store.dispatch(injectUser(create({}, 1)));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: Object.assign({}, testConnection, {
            roomId: 1
          })
        }
      });
    });
    it('should throw error if user already belongs to another room', () => {
      store.dispatch(injectUser(create({}, 1)));
      expect(() => store.dispatch(injectUser(create({}, 2)))).toThrow();
    });
  });

  describe('room/join', () => {
    beforeEach('connect user', () => {
      store.dispatch(connect(testConnection));
    });
    it('should set the roomId to provided value', () => {
      store.dispatch(injectUser(join(1)));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: Object.assign({}, testConnection, {
            roomId: 1
          })
        }
      });
    });
    it('should throw error if user already belongs to another room', () => {
      store.dispatch(injectUser(join(1)));
      expect(() => store.dispatch(injectUser(join(2)))).toThrow();
    });
  });

  describe('room/leave', () => {
    beforeEach('connect user', () => {
      store.dispatch(connect(testConnection));
      store.dispatch(injectUser(join(1)));
    });
    it('should set the roomId to null', () => {
      store.dispatch(injectUser(leave(1)));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: Object.assign({}, testConnection, {
            roomId: null
          })
        }
      });
    });
    it('should throw error if user doesn\'t belong to that room', () => {
      expect(() => store.dispatch(injectUser(leave(2)))).toThrow();
    });
    it('should throw error if user doesn\'t belong to any room', () => {
      store.dispatch(injectUser(leave(1)));
      expect(() => store.dispatch(injectUser(leave(1)))).toThrow();
    });
  });

  describe('room/destroy', () => {
    beforeEach('connect user', () => {
      store.dispatch(connect(testConnection));
      store.dispatch(injectUser(join(1)));
    });
    it('should set the roomId to null', () => {
      // This is impossible /wo the original state, so we have to inject them.
      store.dispatch(injectState(destroy(1), {
        room: {
          list: {
            1: {
              // This should be enough to test this action.
              id: 1,
              users: [1]
            }
          }
        }
      }));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          1: Object.assign({}, testConnection, {
            roomId: null
          })
        }
      });
    });
  });

  describe('@/handshake', () => {
    it('should set state', () => {
      store.dispatch(handshake({
        connection: {
          self: 1,
          list: {
            1: testConnection
          }
        }
      }));
      expect(store.getState()).toEqual({
        self: 1,
        list: {
          1: testConnection
        }
      });
    });

    it('should ignore previous state', () => {
      store.dispatch(connect(testConnection2));
      store.dispatch(handshake({
        connection: {
          self: 1,
          list: {
            1: testConnection
          }
        }
      }));
      expect(store.getState()).toEqual({
        self: 1,
        list: {
          1: testConnection
        }
      });
    });

    it('should ignore errored actions', () => {
      store.dispatch(Object.assign({}, handshake({
        code: 501,
        reason: 'Test'
      }), {
        error: true
      }));
      expect(store.getState()).toEqual({
        self: null,
        list: {}
      });
    });
  });
});
