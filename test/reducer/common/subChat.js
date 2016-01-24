import expect from 'expect';
import subChatReducer from '../../../src/reducer/common/subChat';
import { chat, clearHistory, setLimit } from '../../../src/action/chat';
import { createStore } from 'redux';

const testMessage = {
  type: 'normal',
  message: 'Hello, world!',
  connection: 1
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

describe('subChatReducer', () => {
  let store;
  beforeEach('configure store', () => {
    store = createStore(subChatReducer);
  });

  describe('INIT', () => {
    it('should init with valid fields', () => {
      // We expect createStore already dispatched INIT action.
      expect(store.getState()).toEqual({
        limit: 100,
        messages: []
      });
    });
  });

  describe('CHAT', () => {
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

  describe('CLEAR_HISTORY', () => {
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

  describe('SET_LIMIT', () => {
    it('should set limit', () => {
      store.dispatch(setLimit('lobby', 200));
      expect(store.getState()).toEqual({
        limit: 200,
        messages: []
      });
    });
  });

});
