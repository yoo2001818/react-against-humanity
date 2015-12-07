import expect from 'expect';
import Router from '../../src/utils/router';

const testReq = {
  action: {
    type: 'test/test',
    payload: {},
    meta: {
      class: 'read'
    }
  },
  state: {},
  store: {},
  connector: {}
};

const testRes = {};

describe('Router', () => {
  let router;
  beforeEach('initalize router', () => {
    router = new Router();
  });
  it('should be a function', () => {
    expect(router)
      .toBeA('function')
      .toBeA(Function);
  });
  it('should call next if no route is found', done => {
    router(testReq, testRes, done);
  });
  describe('#use', () => {
    it('should register a middleware', done => {
      router.use(() => {
        done();
      });
      router(testReq, testRes, () => done('should not reach here'));
    });
    it('should be able to handle multiple use', done => {
      router.use((req, res, next) => {
        req.flag = true;
        next();
      });
      router.use(req => {
        if (req.flag) {
          done();
        } else {
          done('Flag not set');
        }
      });
      router(testReq, testRes, () => done('should not reach here'));
    });
    it('should pass error to next', done => {
      router.use((req, res, next) => {
        next('Errrr');
      });
      router(testReq, testRes, err => {
        if (err !== 'Errrr') {
          return done(err + 'was returned instead');
        }
        return done();
      });
    });
  });
  describe('#all', () => {
    it('should check action type', done => {
      router.all('test/test', () => {
        done();
      });
      router.all('toast/toast', () => {
        done('should not reach here');
      });
      router(testReq, testRes, () => done('should not reach here'));
    });
  });
  describe('#METHOD', () => {
    it('should check action class', done => {
      router.write('test/test', () => {
        done('should not reach here');
      });
      router.read('test/test', () => {
        done();
      });
      router(testReq, testRes, () => done('should not reach here'));
    });
    it('should check action type', done => {
      router.read('test/test', () => {
        done();
      });
      router.read('toast/toast', () => {
        done('should not reach here');
      });
      router(testReq, testRes, () => done('should not reach here'));
    });
    it('should check regular expression', done => {
      router.read(/test\/toast/, () => {
        done('should not reach here');
      });
      router.read(/te?st\/te+st/, () => {
        done();
      });
      router.read(/toast\/toast/, () => {
        done('should not reach here');
      });
      router(testReq, testRes, () => done('should not reach here'));
    });
  });
});
