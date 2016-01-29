import expect from 'expect';
import subChatReducer from '../../../src/reducer/common/subChat';
import { chat, clearHistory, setLimit } from '../../../src/action/chat';
import {
  connect, disconnect, login, logout
} from '../../../src/action/connection';
import { create, join, leave } from '../../../src/action/room';
import { createStore } from 'redux';

const testUser = {
  id: 1,
  level: 'guest',
  name: 'test'
};

const testAnonymous = {
  id: 1,
  level: 'anonymous',
  name: 'test'
};

const testMessage = {
  type: 'normal',
  message: 'Hello, world!',
  connection: testUser,
  date: undefined
};

function injectUser(action, user = testUser) {
  return Object.assign({}, action, {
    meta: Object.assign({}, action.meta, {
      target: Object.assign({}, action.meta && action.meta.target, {
        connection: 1
      }),
      // State data mockup
      state: {
        connection: {
          list: {
            1: user
          }
        }
      }
    })
  });
}

describe('subChatReducer', () => {
  let store;
  beforeEach('configure store', () => {
    store = createStore(subChatReducer);
  });

  describe('@/init', () => {
    it('should init with valid fields', () => {
      // We expect createStore already dispatched INIT action.
      expect(store.getState()).toEqual({
        limit: 100,
        messages: []
      });
    });
  });

  describe('@/chat', () => {
    it('should append incoming message', () => {
      // in subChat router, the scope, 'lobby' isn't checked actually.
      // However, this is used to route the action by chat router.
      store.dispatch(injectUser(chat('lobby', 'Hello, world!')));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: [
          testMessage
        ]
      });
    });

    it('should automatically clip incoming messages', () => {
      // Put 100 messages at once.
      let messages = [];
      for (let i = 0; i < 100; ++i) {
        store.dispatch(injectUser(chat('lobby', 'Hello, world!')));
        messages.push(testMessage);
        expect(store.getState()).toEqual({
          limit: 100,
          messages
        });
      }
      // Now, try this again and check if it's clipped.
      messages.shift();
      messages.push(Object.assign({}, testMessage, {
        message: 'Stop spamming!'
      }));
      store.dispatch(injectUser(chat('lobby', 'Stop spamming!')));
      expect(store.getState()).toEqual({
        limit: 100,
        messages
      });
    });
  });

  describe('@/clearHistory', () => {
    it('should clear history', () => {
      // We need to put dummy data into the store before testing this.
      store.dispatch(injectUser(chat('lobby', 'Hello, world!')));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: [
          testMessage
        ]
      });
      // Now, test for real.
      store.dispatch(clearHistory('lobby'));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: []
      });
    });
  });

  describe('@setLimit', () => {
    it('should set limit', () => {
      store.dispatch(setLimit('lobby', 200));
      expect(store.getState()).toEqual({
        limit: 200,
        messages: []
      });
    });
  });

  describe('connection/connect', () => {
    it('should create join message', () => {
      store.dispatch(connect(testUser));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: [{
          connection: testUser,
          type: 'join',
          date: undefined
        }]
      });
    });
    it('should ignore anonymous action', () => {
      store.dispatch(connect(testAnonymous));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: []
      });
    });
  });

  describe('connection/disconnect', () => {
    it('should create leave message', () => {
      store.dispatch(injectUser(disconnect(testUser)));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: [{
          connection: testUser,
          type: 'leave',
          date: undefined
        }]
      });
    });
    it('should ignore anonymous action', () => {
      store.dispatch(injectUser(disconnect(testAnonymous), testAnonymous));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: []
      });
    });
  });

  describe('connection/login', () => {
    it('should create join message', () => {
      store.dispatch(login(testUser));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: [{
          connection: testUser,
          type: 'join',
          date: undefined
        }]
      });
    });
  });

  describe('connection/logout', () => {
    it('should create leave message', () => {
      store.dispatch(injectUser(logout(testUser)));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: [{
          connection: testUser,
          type: 'leave',
          date: undefined
        }]
      });
    });
  });

  describe('room/create', () => {
    it('should create join message', () => {
      store.dispatch(injectUser(create({}, 1)));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: [{
          connection: testUser,
          type: 'join',
          date: undefined
        }]
      });
    });
  });

  describe('room/join', () => {
    it('should create join message', () => {
      store.dispatch(injectUser(join(1)));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: [{
          connection: testUser,
          type: 'join',
          date: undefined
        }]
      });
    });
  });

  describe('room/leave', () => {
    it('should create leave message', () => {
      store.dispatch(injectUser(leave(1)));
      expect(store.getState()).toEqual({
        limit: 100,
        messages: [{
          connection: testUser,
          type: 'leave',
          date: undefined
        }]
      });
    });
  });

});
