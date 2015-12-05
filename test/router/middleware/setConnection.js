import expect from 'expect';
import setConnection from '../../../src/router/middleware/setConnection';

describe('setConnection', () => {
  it('should override action\' connection', () => {
    let req = {
      action: {
        type: 'test/test',
        payload: {},
        meta: {
          connection: 53
        }
      },
      cause: 'poll',
      connection: 1
    };
    let res = {
      resolve() {}, reject() {}
    };
    setConnection(req, res, () => {});
    expect(req.action).toEqual({
      type: 'test/test',
      payload: {},
      meta: {
        connection: 1
      }
    });
  });
  it('should ignore requests from middleware', () => {
    let req = {
      action: {
        type: 'test/test',
        payload: {},
        meta: {
          connection: 53
        }
      },
      cause: 'middleware',
      connection: 1
    };
    let res = {
      resolve() {}, reject() {}
    };
    setConnection(req, res, () => {});
    expect(req.action).toEqual({
      type: 'test/test',
      payload: {},
      meta: {
        connection: 53
      }
    });
  });
});
