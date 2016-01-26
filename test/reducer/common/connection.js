import expect from 'expect';
import connectionReducer from '../../../src/reducer/common/connection';
import {
  update, handshake, connect, disconnect, login, logout
} from '../../../src/action/connection';
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

describe('connectionReducer', () => {
  let store;
  beforeEach('configure store', () => {
    store = createStore(connectionReducer);
  });

  describe('INIT', () => {
    it('should init with valid fields', () => {
      // We expect createStore already dispatched INIT action.
      expect(store.getState()).toEqual({
        self: null,
        list: {}
      });
    });
  });

  describe('CONNECT', () => {
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

  describe('DISCONNECT', () => {
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

  describe('UPDATE', () => {
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

  describe('LOGIN', () => {
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
  });

  describe('LOGIN', () => {
    beforeEach('connect user', () => {
      store.dispatch(connect(testConnection));
    });

    it('should set level to anonymous', () => {
      store.dispatch(login({
        id: 1,
        level: 'guest',
        name: 'Hey'
      }));
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
  });

  describe('HANDSHAKE', () => {
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
