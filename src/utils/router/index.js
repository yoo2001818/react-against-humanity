import ExpressRouter from 'express/lib/router';
import Layer from 'express/lib/router/layer';
import Route from './route';

// Since express router is pretty good, I'm just reusing it.
// However, to workaround security leaks and overheads, I need to reimplement
// router.

const proto = function () {

  function router(req, res, next) {
    router.handle(req, res, next);
  }

  // mixin Router class functions
  router.__proto__ = proto;

  router.params = {};
  router._params = [];
  router.caseSensitive = true;
  router.mergeParams = false;
  router.strict = true;
  router.stack = [];

  return router;
};

proto.__proto__ = ExpressRouter;

// Hook function to use new route object
proto.route = function route(path) {
  var route = new Route('/' + path);

  var layer = new Layer('/' + path, {
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  }, route.dispatch.bind(route));

  layer.route = route;

  this.stack.push(layer);
  return route;
};

proto.handle = function handle(req, res, out) {
  // Inject URL and method if not available.
  if (req.url === undefined) req.url = '/' + req.action.type;
  if (req.method === undefined) {
    req.method = req.class || req.action.meta.class;
  }
  ExpressRouter.handle.call(this, req, res, out);
};

// Register custom methods.
for (let method of ['read', 'write', 'after']) {
  proto[method] = function (path, ...args) {
    var route = this.route(path);
    route[method].apply(route, args);
    return this;
  };
}

export default proto;
