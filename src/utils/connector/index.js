export default class Connector {
  constructor(router, store, middlewareRouter) {
    this.router = router;
    this.store = store;
    this.middlewareRouter = middlewareRouter;
  }

  callRouter(req, router) {
    return new Promise((resolve, reject) => {
      let res = { resolve, reject };
      try {
        router(req, res, error => {
          reject(error || new Error('Nothing handled the action'));
        });
      } catch (e) {
        reject(e);
      }
    });
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
