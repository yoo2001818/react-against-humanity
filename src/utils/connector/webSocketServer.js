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
        const { dataString } = event;
        // Try to parse the data string;
        const action = parseJSON(dataString);
        if (action instanceof Error) {
          debug('JSON parsing error while receiving from ' + clientId);
          debug('closing session for ' + clientId);
          // Close client if this happends.
          client.close();
          this.handle(TransportActions.close(event), clientId);
          delete this.clients[clientId];
        } else {
          // Resolve action and finish if ticket is set.
          if (action && action.meta &&
            action.meta.ticketResponse !== undefined
          ) {
            const ticketId = action.meta.ticketResponse;
            if (!Number.isInteger(ticketId) || this.tickets[ticketId] == null) {
              debug('wrong ticketResponse received from ' + clientId);
              debug(action);
              debug('closing session for ' + clientId);
              // Close client if malformed
              client.close();
              this.handle(TransportActions.close(event), clientId);
              return;
            }
            debug('resolving ticket ' + ticketId + ' from ' + clientId);
            client.tickets[ticketId].resolve(action);
            return;
          }
          if (action && action.meta &&
            action.meta.ticketRequest !== undefined
          ) {
            const ticketId = action.meta.ticketRequest;
            debug('handling ticketRequest ' + ticketId + ' from ' + clientId);
            this.handle(action, -1)
            .then(action => {
              debug('replying ' + ticketId + ' to ' + clientId);
              action.meta.ticketResponse = ticketId;
              this.dispatch(action, -1);
            }, error => {
              debug('replying ' + ticketId + ' with error to ' + clientId);
              return this.dispatch(Object.assign({}, action, {
                payload: error,
                meta: Object.assign({}, action.meta, {
                  ticketResponse: ticketId
                }),
                error: true
              }), -1);
            });
            return;
          }
          debug('handling message from ' + clientId);
          this.handle(action, -1);
        }
      };
      client.onerror = event => {
        debug('error, ' + event.message + ' from ' + clientId);
        this.handle(TransportActions.error(event), clientId);
      };
      client.onclose = event => {
        debug('connection closed, ' + event.code + ' of ' + clientId);
        this.handle(TransportActions.close(event), clientId);
      };
    });
    this.server = server;
  }

  dispatch(actionRaw, connection, ticket = false) {
    const client = this.clients[connection];
    if (client == null) {
      throw new Error('Tried to send message to nonexistent connection');
    }
    let action = actionRaw;
    // Inject ticket number if Promise is required.
    if (ticket) {
      debug('sending message with ticket ' + client.tickets.length + ' to ' +
        connection);
      action = Object.assign({}, actionRaw, {
        meta: Object.assign({}, actionRaw.meta, {
          ticketRequest: client.tickets.length
        })
      });
    } else {
      debug('sending message to ' + connection);
    }
    // Serialize action data.
    const dataString = JSON.stringify(action);
    // Send it...
    client.send(dataString);
    if (ticket) {
      // Register ticket if ticket is available.
      return new Promise((resolve, reject) => {
        client.tickets.push({ resolve, reject });
      });
    }
  }
}