import expect from 'expect';
import subChatReducer from '../../src/reducers/subChat.js';
import { chat, clearHistory, setLimit } from '../../src/actions/chat.js';
import { createStore } from 'redux';

const testUser = {
  id: 1,
  name: 'Anonymous'
};

const testMessage = {
  type: 'normal',
  message: 'Hello, world!',
  user: 2
};

describe('reducers', () => {
  describe('#subChat', () => {
    let store;
    beforeEach('configure store', () => {
      store = createStore(subChatReducer);
    });

    it('should init with valid fields', () => {
      // We expect createStore already dispatched INIT action.
      expect(store.getState()).toEqual({
        limit: 100,
        messages: []
      });
    });

    it('should process CHAT action', () => {
      // in subChat router, the scope, 'lobby' isn't checked actually.
      // However, this is used to route the action by chat router.
      store.dispatch(chat('lobby', testUser, 'Hello, world!'));
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
        store.dispatch(chat('lobby', testUser, 'Hello, world!'));
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
      store.dispatch(chat('lobby', testUser, 'Stop spamming!'));
      expect(store.getState()).toEqual({
        limit: 100,
        messages
      });
    });

    it('should process CLEAR_HISTORY action', () => {
      // We need to put dummy data into the store before testing this.
      store.dispatch(chat('lobby', testUser, 'Hello, world!'));
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

    it('should process SET_LIMIT action', () => {
      store.dispatch(setLimit('lobby', 200));
      expect(store.getState()).toEqual({
        limit: 200,
        messages: []
      });
    });

  });
});