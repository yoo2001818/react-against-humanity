import blockNonAction from '../../../src/router/middleware/blockNonAction';

describe('blockNonAction', () => {
  it('should block non action', done => {
    let req = {
      action: 'nope'
    };
    let res = {
      resolve() {},
      reject() {
        done();
      }
    };
    blockNonAction(req, res, () => {
      done('should not reach here');
    });
  });
  it('should not block action', done => {
    let req = {
      action: {
        type: 'test/test'
      }
    };
    let res = {
      resolve() {},
      reject() {
        done('should not reach here');
      }
    };
    blockNonAction(req, res, () => {
      done();
    });
  });
});
