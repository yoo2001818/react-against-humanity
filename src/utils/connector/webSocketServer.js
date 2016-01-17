// WebSocket server.
import CommonConnector from './webSocketCommon';

export default class WebSocketServerConnector extends CommonConnector {
  constructor(router, store, server) {
    super(router, store);
    server.on('connection', client => {
      const clientId = this.handleCreate(client);
      this.handleOpen(clientId);
      client.onmessage = event => this.handleMessage(event.data, clientId);
      client.onerror = event => this.handleError(event, clientId);
      client.onclose = event => this.handleClose(event, clientId);
    });
    this.server = server;
  }
}
