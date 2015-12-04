import expect from 'expect';
import PassConnector from '../../src/utils/connector/pass';

const testAction = {
  type: 'test/test',
  payload: {},
  meta: {
    class: 'read'
  }
};

describe('PassConnector', () => {
  let connector;
  beforeEach('initalize connector', () => {
    // Since this sets everything to dummy object, router and handler
    // should be set if test is required
    connector = new PassConnector(() => {}, {}, () => {});
  });
  describe('#handle', () => {
    it('should call the router', done => {
      connector.router = () => {
        done();
      };
      connector.handle(1, testAction);
    });
    it('should return a Promise', () => {
      expect(connector.handle(1, testAction)).toBeA(Promise);
    });
    it('should call with req, res, next', () => {
      connector.router = (req, res, next) => {
        expect(req).toEqual({
          action: testAction,
          connection: 1,
          store: connector.store,
          connector
        });
        expect(res.resolve).toBeA('function');
        expect(res.reject).toBeA('function');
        expect(next).toBeA('function');
        // Resolve it; We need to resolve a Promise in order to
        // finish this test.
        res.resolve();
      };
      return connector.handle(1, testAction);
    });
    it('should reject if router didn\'t handle action', () => {
      connector.router = (req, res, next) => next();
      return connector.handle(1, testAction)
      .then(() => {
        throw new Error('Should throw an error');
      }, () => 'ok');
    });
  });
  describe('#notify', () => {
    it('should call the router', done => {
      connector.router = () => {
        done();
      };
      connector.notify(testAction);
    });
    it('should return a Promise', () => {
      expect(connector.notify(testAction)).toBeA(Promise);
    });
    it('should call with req, res, next', () => {
      connector.router = (req, res, next) => {
        expect(req).toEqual({
          action: testAction,
          class: 'after',
          store: connector.store,
          connector
        });
        expect(res.resolve).toBeA('function');
        expect(res.reject).toBeA('function');
        expect(next).toBeA('function');
        // Resolve it; We need to resolve a Promise in order to
        // finish this test.
        res.resolve();
      };
      return connector.notify(testAction);
    });
    it('should reject if router didn\'t handle action', () => {
      connector.router = (req, res, next) => next();
      return connector.notify(testAction)
      .then(() => {
        throw new Error('Should throw an error');
      }, () => 'ok');
    });
  });
  describe('#dispatch', () => {
    // Since dispatch function is overrided by PassConnector, this is pretty
    // meaningless.
    it('should call the handler', done => {
      connector.handler = () => done();
      connector.dispatch(1, testAction);
    });
  });
});
