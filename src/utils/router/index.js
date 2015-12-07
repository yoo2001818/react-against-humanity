import Route from './route';

const proto = function () {

  function router(req, res, next) {
    router.handle(req, res, next);
  }

  Object.setPrototypeOf(router, proto);
  router.stack = [];
  return router;

  // Route: class, cause, type, route
};

proto.use = function use(...routes) {
  this.stack.push(new Route(null, null, null, routes));
};

proto.add = function add(classType, cause, type, ...routes) {
  this.stack.push(new Route(classType, cause, type, routes));
};

proto.all = function all(type, ...routes) {
  this.stack.push(new Route(null, null, type, routes));
};

for (let classType of ['read', 'write', 'internal']) {
  proto[classType] = function (type, ...routes) {
    this.stack.push(new Route(classType, null, type, routes));
  };
}

for (let cause of ['poll', 'middleware']) {
  proto[cause] = function (type, ...routes) {
    this.stack.push(new Route(null, cause, type, routes));
  };
}

proto.handle = function handle(req, res, next) {
  let i = -1;
  const processNext = (err) => {
    i++;
    if (err) return next(err);
    if (i >= this.stack.length) {
      return next(err);
    }
    let current = this.stack[i];
    return current.handle(req, res, processNext);
  };
  processNext();
};

export default proto;
