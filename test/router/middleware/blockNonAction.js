import expect from 'expect';
import blockNonAction from '../../../src/router/middleware/blockNonAction';

describe('blockNonAction', () => {
  it('should block non action', () => {
    let req = {
      action: 'nope'
    };
    expect(() => blockNonAction(req, () => {})).toThrow();
  });
  it('should not block action', () => {
    let req = {
      action: {
        type: 'test/test'
      }
    };
    blockNonAction(req, () => {});
  });
});
