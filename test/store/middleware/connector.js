import expect from 'expect';
import { createStore, applyMiddleware } from 'redux';
import PassConnector from '../../../src/utils/connector/pass';
import connectorMiddleware from '../../../src/store/middleware/connector';

const testAction = {
  type: 'test/test',
  payload: {},
  meta: {
    class: 'read'
  }
};

describe('connectorMiddleware', () => {
  let store, reducer, connector;
  beforeEach('initalize store', () => {
    // Dummy reducer that just passes the action.
    reducer = (state = {}) => state;
    // Dummy connector that is connected to the middleware.
    connector = new PassConnector(() => {}, {}, () => {});
    // Create a store.
    const middlewares = applyMiddleware(connectorMiddleware(connector));
    const createStoreWithMiddleware = middlewares(createStore);
    // To 'override' reducer, We create delegate function to pass request to
    // local function.
    store = createStoreWithMiddleware(
      (state, action) => reducer(state, action)
    );
  });
  it('should call connector if action class is read or write', () => {
    let dispatched = false;
    connector.router = () => {
      dispatched = true;
    };
    store.dispatch(testAction);
    expect(dispatched).toBe(true, 'Should run when class is read');
    dispatched = false;
    store.dispatch({
      type: 'test/test',
      payload: {},
      meta: {
        class: 'write'
      }
    });
    expect(dispatched).toBe(true, 'Should run when class is write');
  });
  it('should skip if action class is not specified or internal', () => {
    let dispatched = false;
    connector.router = () => {
      dispatched = true;
    };
    store.dispatch({
      type: 'test/test',
      payload: {},
      meta: {}
    });
    expect(dispatched).toBe(false, 'Should not run when class is undefined');
    store.dispatch({
      type: 'test/test',
      payload: {},
      meta: {
        class: 'internal'
      }
    });
    expect(dispatched).toBe(false, 'Should not run when class is internal');
  });
  it('should call next if resolved value is action', () => {
    let dispatched = false;
    let resolveObj = {
      type: 'test/target',
      payload: {},
      meta: {}
    };
    connector.router = (req, res) => {
      res.resolve(resolveObj);
    };
    reducer = (state = {}, action) => {
      if (action && action.type === 'test/test') return state;
      dispatched = true;
      return state;
    };
    return store.dispatch(testAction)
    .then(() => {
      expect(dispatched).toBe(true, 'Should call next if action is returned');
      resolveObj = 'Nice boat';
      dispatched = false;
    })
    .then(() => store.dispatch(testAction))
    .then(() => {
      expect(dispatched).toBe(false,
        'Shouldn\'t call next if anything else is returned');
      resolveObj = undefined;
      dispatched = false;
    })
    .then(() => store.dispatch(testAction))
    .then(() => {
      expect(dispatched).toBe(false,
        'Shouldn\'t call next if undefined is returned');
    });
  });
  it('should call next with an error if rejected', () => {
    connector.router = () => {
      throw new Error('Nope.');
    };
    reducer = (state = {}, action) => {
      return {
        message: action.payload.message
      };
    };
    return store.dispatch(testAction)
    .then(() => {
      expect(store.getState()).toEqual({
        message: 'Nope.'
      });
    });
  });
});
