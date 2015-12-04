import expect from 'expect';
import connectionReducer from '../../src/reducer/connection';
import {
  update, handshake, connect, disconnect
} from '../../src/action/connection';
import { createStore } from 'redux';

const testConnection = {
  id: 1,
  name: 'Anonymous'
};

const testConnection2 = {
  id: 2,
  name: 'Guest'
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

    // Alternatively, connection 'removed' flag can be set.
    // However, I'll change this if it is required.
    // Until then, this is default behavior.
    it('should remove connection from the list', () => {
      store.dispatch(disconnect(testConnection));
      expect(store.getState()).toEqual({
        self: null,
        list: {}
      });
    });

    it('should handle multiple connections', () => {
      store.dispatch(connect(testConnection2));

      store.dispatch(disconnect(testConnection));
      expect(store.getState()).toEqual({
        self: null,
        list: {
          2: testConnection2
        }
      });

      store.dispatch(disconnect(testConnection2));
      expect(store.getState()).toEqual({
        self: null,
        list: {}
      });
    });

    it('should throw an error if not exists', () => {
      store.dispatch(disconnect(testConnection));
      expect(() => {
        store.dispatch(disconnect(testConnection));
      }).toThrow();
    });

    it('should ignore errored actions', () => {
      store.dispatch(Object.assign({}, disconnect(testConnection), {
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
            coolnessModifier: 0.2
          }
        }
      });
    });

    it('should throw an error if not exists', () => {
      store.dispatch(disconnect(testConnection));
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
