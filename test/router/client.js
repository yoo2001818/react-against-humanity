// Client router should....
// Dispatch action to the server from middleware, and send the results back.
// Dispatch action to the store from polling.

import expect from 'expect';
import PassConnector from '../../src/utils/connector/pass';
import clientRouter from '../../src/router/client';

const testAction = {
  type: 'test/test',
  payload: {},
  meta: {
    class: 'read'
  }
};

describe('clientRouter', () => {
  let connector;
  beforeEach('initalize connector', () => {
    connector = new PassConnector(clientRouter, {}, () => {});
  });
  it('should dispatch action to the server from middleware', () => {
    let dispatched = false;
    connector.handler = action => {
      dispatched = action;
    };
    return connector.notify(testAction)
    .then(() => {
      expect(dispatched).toEqual(testAction);
    });
  });
  it('should dispatch action to the store from polling', () => {
    let dispatched = false;
    connector.store = {
      dispatch: action => {
        dispatched = action;
      }
    };
    return connector.handle(testAction)
    .then(() => {
      expect(dispatched).toEqual(Object.assign({}, testAction, {
        meta: Object.assign({}, testAction.meta, {
          class: 'internal'
        })
      }));
    });
  });
});
