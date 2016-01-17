// WebSocket server.
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

export default class WebSocketServerConnector extends Connector {
  constructor(router, store, server) {
    super(router, store);
    // Client ID should be unique
    this.clients = {};
    this.clientId = 0;
    debug('instance created');
    server.on('connection', client => {
      const clientId = this.clientId ++;
      debug('client ' + clientId + ' connected');
      this.clients[clientId] = client;
      client.tickets = [];
      this.handle(TransportActions.open(clientId), clientId);
      client.onmessage = event => {
        const { data: dataString } = event;
        // Try to parse the data string;
        const packet = parseJSON(dataString);
        if (packet instanceof Error) {
          debug('JSON parsing error while receiving from ' + clientId);
          debug('closing session for ' + clientId);
          // Close client if this happends.
          client.close();
          this.handle(TransportActions.close({
            code: 500,
            reason: 'Protocol error'
          }), clientId);
          this.handle(TransportActions.close(event), clientId);
          delete this.clients[clientId];
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
              client.close();
              this.handle(TransportActions.close({
                code: 500,
                reason: 'Protocol error'
              }), clientId);
              return;
            }
            debug('resolving ticket ' + ticketRes + ' from ' + clientId);
            client.tickets[ticketRes].resolve(action);
            return;
          }
          if (ticketReq !== undefined) {
            debug('handling ticketRequest ' + ticketReq + ' from ' + clientId);
            this.handle(action, clientId)
            .then(action => {
              debug('replying ' + ticketReq + ' to ' + clientId);
              return this.dispatch(action, clientId, null, ticketReq);
            }, error => {
              debug(error.stack);
              debug('replying ' + ticketReq + ' with error to ' + clientId);
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
      };
      client.onerror = event => {
        debug('error, ' + event.message + ' from ' + clientId);
        this.handle(TransportActions.error(event), clientId);
      };
      client.onclose = event => {
        debug('connection closed, ' + event.code + ' of ' + clientId);
        this.handle(TransportActions.close({
          code: event.code,
          reason: event.reason
        }), clientId);
      };
    });
    this.server = server;
  }

  dispatch(action, connection, ticketReq, ticketRes) {
    const client = this.clients[connection];
    if (client == null) {
      throw new Error('Tried to send message to nonexistent connection');
    }
    let packet = { action };
    // Inject ticket number, this one is verbose one.
    if (ticketRes != null) packet.ticketRes = ticketRes;
    // However this won't do anything if 'true' is not given, this will just
    // send raw ticket request without handling it.
    if (ticketReq != null) packet.ticketReq = ticketReq;
    // Inject ticket number if Promise is required.
    if (ticketReq === true) {
      debug('sending message with ticket ' + client.tickets.length + ' to ' +
        connection);
      packet.ticketReq = client.tickets.length;
    } else {
      debug('sending message to ' + connection);
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
