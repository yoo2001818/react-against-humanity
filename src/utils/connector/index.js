export default class Connector {
  constructor(router, store) {
    this.router = router;
    this.store = store;
  }

  callRouter(req) {
    return new Promise((resolve, reject) => {
      let res = { resolve, reject };
      try {
        this.router(req, res, () => {
          reject(new Error('Nothing handled the action'));
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // Protocol -> Router
  handle(connection, action) {
    // Notify action and connection to router.
    let req = {
      connector: this,
      store: this.store,
      action, connection
    };
    return this.callRouter(req);
  }

  // Middleware -> Router
  notify(action) {
    // Notify action to router.
    let req = {
      connector: this,
      store: this.store,
      class: 'after',
      action
    };
    return this.callRouter(req);
  }

  // Router -> Protocol
  dispatch(connection, action) { // eslint-disable-line no-unused-vars
    // Send action to the connection.
    throw new Error('Not implemented by subclass');
  }

}
