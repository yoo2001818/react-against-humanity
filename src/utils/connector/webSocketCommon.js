// WebSocket common protocol. Shared by both client and server.
// However this doesn't do anything more than handling request and packet,
// Extending classes should do it.
import Connector from './index';
import * as TransportActions from '../../action/transport';
import rawDebug from 'debug';

const debug = rawDebug('app:connector:websocket');

// To workaround V8's optimization problem, put try/catch on seperate functions.
function parseJSON(string) {
  try {
    return JSON.parse(string);
  } catch (e) {
    return e;
  }
}

export default class WebSocketCommonConnector extends Connector {
  constructor(router, store) {
    super(router, store);
    this.clients = {};
    this.clientId = 1;
    debug('instance created');
  }
  getNextClientId() {
    return this.clientId ++;
  }
  getClient(clientId) {
    const client = this.clients[clientId];
    if (client == null) throw new Error('Cannot find client ' + clientId);
    return client;
  }
  disconnect(code = 1000, reason, clientId) {
    const client = this.getClient(clientId);
    client.close(code, reason);
    return this.handleClose({ code, reason }, clientId);
  }
  handleClose(event, clientId) {
    debug('connection closed, ' + event.code + ' of ' + clientId);
    this.handle(TransportActions.close({
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean
    }), clientId)
    .then(() => {
      // Clean up the mess after everything is processed.
      delete this.clients[clientId];
    });
  }
  // Since create / connect is handled differently for client, we need another
  // function for this. Server should call handleConnect right after this.
  handleCreate(client) {
    const clientId = this.getNextClientId();
    debug('client ' + clientId + ' created');
    this.clients[clientId] = client;
    client.tickets = [];
    this.handle(TransportActions.create(clientId), clientId);
    return clientId;
  }
  handleOpen(clientId) {
    // Well this doesn't do anything for now.
    debug('client ' + clientId + ' connected');
    this.handle(TransportActions.open(clientId), clientId);
  }
  handleError(event, clientId) {
    debug('error, ' + event.message + ' from ' + clientId);
    this.handle(TransportActions.error(event), clientId);
  }
  handleMessage(dataString, clientId) {
    const client = this.getClient(clientId);
    // Try to parse the data string.
    const packet = parseJSON(dataString);
    if (packet instanceof Error) {
      debug('JSON parsing error while receiving from ' + clientId);
      debug('closing session for ' + clientId);
      this.disconnect(500, 'Protocol error', clientId);
    } else {
      let { action, ticketRes, ticketReq } = packet;
      // Resolve action and finish if ticket is set.
      if (ticketRes !== undefined) {
        if (!Number.isInteger(ticketRes) ||
          client.tickets[ticketRes] == null
        ) {
          debug('wrong ticketResponse received from ' + clientId);
          debug(action);
          debug('closing session for ' + clientId);
          // Close client if malformed
          this.disconnect(500, 'Protocol error', clientId);
          return;
        }
        debug('resolving ticket ' + ticketRes + ' from ' + clientId);
        client.tickets[ticketRes].resolve(action);
        return;
      }
      // Process ticket request too.
      if (ticketReq !== undefined) {
        debug('handling ticketRequest ' + ticketReq + ' from ' + clientId);
        this.handle(action, clientId)
        .then(action => {
          debug('replying ' + ticketReq + ' to ' + clientId);
          return this.dispatch(action, clientId, null, ticketReq);
        }, error => {
          debug(error.stack);
          debug('replying ' + ticketReq + ' with error to ' + clientId);
          // Hmm. We shouldn't send error message in production. TODO
          // It's alright in development mode though.
          return this.dispatch(Object.assign({}, action, {
            payload: (error instanceof Error) ? {
              stack: error.stack,
              message: error.message
            } : error,
            error: true
          }), clientId, null, ticketReq);
        });
        return;
      }
      debug('handling message from ' + clientId);
      this.handle(action, clientId);
    }
  }
  dispatch(action, clientId, ticketReq, ticketRes) {
    const client = this.getClient(clientId);
    let packet = { action };
    // Inject ticket number, this one is verbose one.
    if (ticketRes != null) packet.ticketRes = ticketRes;
    // However this won't do anything if 'true' is not given, this will just
    // send raw ticket request without handling it.
    if (ticketReq != null) packet.ticketReq = ticketReq;
    // Inject ticket number if Promise is required.
    if (ticketReq === true) {
      debug('sending message with ticket ' + client.tickets.length + ' to ' +
        clientId);
      packet.ticketReq = client.tickets.length;
    } else {
      debug('sending message to ' + clientId);
    }
    // Serialize action data.
    const dataString = JSON.stringify(packet);
    // Send it...
    client.send(dataString);
    if (ticketReq === true) {
      // Register ticket if ticket is available.
      return new Promise((resolve, reject) => {
        client.tickets.push({ resolve, reject });
      });
    }
  }
}
