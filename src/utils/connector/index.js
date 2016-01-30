export default class Connector {
  constructor(router, store, middlewareRouter) {
    this.router = router;
    this.store = store;
    this.middlewareRouter = middlewareRouter;
  }

  callRouter(req, router) {
    try {
      let returned = router(req, error => {
        throw new Error(error || new Error('Nothing handled the action'));
      });
      // If returned one is a Promise object, just return it
      if (returned && typeof returned.then === 'function') {
        return returned;
      }
      // If not, wrap it.
      return Promise.resolve(returned);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  // Protocol -> Router
  handle(action, connection) {
    // Notify action and connection to router.
    let req = {
      connector: this,
      store: this.store,
      cause: 'poll',
      action, connection
    };
    return this.callRouter(req, this.router);
  }

  // Middleware -> Router
  notify(action) {
    // Notify action to router.
    let req = {
      connector: this,
      store: this.store,
      cause: 'middleware',
      action
    };
    return this.callRouter(req, this.middlewareRouter || this.router);
  }

  // Router -> Protocol
  dispatch(action, connection) { // eslint-disable-line no-unused-vars
    // Send action to the connection.
    throw new Error('Not implemented by subclass');
  }

}
