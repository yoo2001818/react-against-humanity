// WebSocket client; Connects to a WebSocket server.
import CommonConnector from './webSocketCommon';
// WebSocket MUST be supported by web browsers.
// import WebSocket from 'ws';

// Client's connection ID is always '-1' by the connector.
// However, routers can override it before reducers processing it.
export default class WebSocketClientConnector extends CommonConnector {
  constructor(router, store, address, protocols, options) {
    super(router, store);
    this.address = address;
    this.protocols = protocols;
    this.options = options;
  }
  // Always return -1.
  getNextClientId() {
    return -1;
  }
  // Always return -1 client.
  getClient() {
    return this.clients[-1];
  }
  reconnect(
    address = this.address,
    protocols = this.protocols,
    options = this.options
  ) {
    let oldClient = this.getClient();
    if (oldClient &&
      (oldClient.readyState === 0 || oldClient.readyState === 1)
    ) {
      return;
    }
    this.address = address;
    this.protocols = protocols;
    this.options = options;
    let client = new WebSocket(address, protocols, options);
    let clientId = this.handleCreate(client);
    client.onopen = () => this.handleOpen(clientId);
    client.onmessage = event => this.handleMessage(event.data, clientId);
    client.onerror = event => this.handleError(event, clientId);
    client.onclose = event => this.handleClose(event, clientId);
  }
}
