import ExpressRoute from 'express/lib/router/route';
import Layer from 'express/lib/router/layer';
import flatten from 'array-flatten';
import rawDebug from 'debug';

const debug = rawDebug('express:router:route');

export default function Route(path) {
  ExpressRoute.call(this, path);
}

Route.prototype = Object.create(ExpressRoute.prototype);
Route.prototype.constructor = Route;

// Register custom methods

for (let method of ['read', 'write', 'after']) {
  Route.prototype[method] = function (...args) {
    var handles = flatten(args);

    for (var i = 0; i < handles.length; i++) {
      var handle = handles[i];

      if (typeof handle !== 'function') {
        var type = String.prototype.toString.call(handle);
        var msg = 'Route.' + method +
          '() requires callback functions but got a ' + type;
        throw new Error(msg);
      }

      debug('%s %s', method, this.path);

      var layer = Layer('/', {}, handle);
      layer.method = method;

      this.methods[method] = true;
      this.stack.push(layer);
    }

    return this;
  };
}
