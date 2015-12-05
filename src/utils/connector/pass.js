import Connector from './index';

// Connector that just passes actions to the handler.
// Used only for unit testing; Wouldn't be used in production code.
// However, since unit test uses this, test will fail if this is removed.

export default class PassConnector extends Connector {
  constructor(router, store, handler) {
    super(router, store);
    this.handler = handler;
  }

  dispatch(action, connection, ticket = false) {
    if (!ticket) return this.handler(action, connection);
    return Promise.resolve()
    .then(() => this.handler(action, connection));
  }
}
