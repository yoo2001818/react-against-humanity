import expect from 'expect';
import userReducer from '../../src/reducer/user.js';
import {
  fetch,
  handshake,
  connect,
  disconnect,
  signOut,
  signIn
} from '../../src/action/user.js';
import { createStore } from 'redux';

const testUser = {
  id: 1,
  name: 'Anonymous'
};

describe('reducers', () => {
  describe('#user', () => {
    let store;
    beforeEach('configure store', () => {
      store = createStore(userReducer);
    });

    it('should init with valid fields', () => {
      // We expect createStore already dispatched INIT action.
      expect(store.getState()).toEqual({
        limit: 100,
        messages: []
      });
    });

  });
});
