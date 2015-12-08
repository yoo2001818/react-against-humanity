// WebSocket client; Connects to a WebSocket server.
import Connector from './index';
import WebSocket from 'ws';
import * as TransportActions from '../../action/transport';
import rawDebug from 'debug';
import omit from 'lodash.omit';

const debug = rawDebug('app:connector:websocket');

// To workaround V8's optimization problem, put try/catch on seperate functions.
function parseJSON(string) {
  try {
    return JSON.parse(string);
  } catch (e) {
    return e;
  }
}

function sanitizeTickets(action) {
  return Object.assign({}, action, {
    meta: omit(action.meta || {}, [
      'ticketResponse', 'ticketRequest'
    ])
  });
}

// Client's connection ID is always '-1' by the connector.
// However, routers can override it before reducers processing it.
export default class WebSocketClientConnector extends Connector {
  constructor(router, store, address, protocols, options) {
    super(router, store);
    this.tickets = [];
    this.address = address;
    this.protocols = protocols;
    this.options = options;
  }

  disconnect(code = 1000, reason) {
    if (this.socket == null) return;
    this.socket.close(code, reason);
  }

  reconnect(
    address = this.address,
    protocols = this.protocols,
    options = this.options
  ) {
    if (this.socket &&
      (this.socket.readyState === 0 || this.socket.readyState === 1)
    ) {
      return;
    }
    this.address = address;
    this.protocols = protocols;
    this.options = options;
    debug('connecting to the endpoint');
    this.handle(TransportActions.create(-1), -1);
    let ws = new WebSocket(address, protocols, options);
    ws.onopen = () => {
      debug('connected to the endpoint');
      this.handle(TransportActions.open(-1), -1);
    };
    ws.onmessage = event => {
      const { data: dataString } = event;
      // Try to parse the data string;
      const action = parseJSON(dataString);
      if (action instanceof Error) {
        debug('JSON parsing error while receiving');
        // Or not. :P Just ignore it if this happens.
      } else {
        // Resolve action and finish if ticket is set.
        if (action && action.meta && action.meta.ticketResponse !== undefined) {
          const ticketId = action.meta.ticketResponse;
          if (!Number.isInteger(ticketId) || this.tickets[ticketId] == null) {
            debug('wrong ticketResponse received; dropping');
            debug(action);
            return;
          }
          debug('resolving ticket ' + ticketId);
          this.tickets[ticketId].resolve(sanitizeTickets(action));
          return;
        }
        if (action && action.meta && action.meta.ticketRequest !== undefined) {
          const ticketId = action.meta.ticketRequest;
          debug('handling ticketRequest ' + ticketId);
          this.handle(sanitizeTickets(action), -1)
          .then(action => {
            debug('replying ticket ' + ticketId);
            return this.dispatch(Object.assign({}, action, {
              meta: Object.assign({}, action.meta, {
                ticketResponse: ticketId
              })
            }), -1);
          }, error => {
            debug(error.stack);
            debug('replying ticket' + ticketId + ' with an error');
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
        debug('handling message');
        this.handle(action, -1);
      }
    };
    ws.onerror = event => {
      debug('error, ' + event);
      this.handle(TransportActions.error(event), -1);
    };
    ws.onclose = event => {
      debug('connection closed, ' + event.code);
      this.handle(TransportActions.close({
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      }), -1);
    };
    this.socket = ws;
  }

  dispatch(actionRaw, connection, ticket = false) {
    // Ignore connection; It's only for the server.
    let action = actionRaw;
    // Inject ticket number if Promise is required.
    if (ticket) {
      debug('sending message with ticket ' + this.tickets.length);
      action = Object.assign({}, actionRaw, {
        meta: Object.assign({}, actionRaw.meta, {
          ticketRequest: this.tickets.length
        })
      });
    } else {
      debug('sending message');
    }
    // Serialize action data.
    const dataString = JSON.stringify(action);
    // Send it...
    this.socket.send(dataString);
    if (ticket) {
      // Register ticket if ticket is available.
      return new Promise((resolve, reject) => {
        this.tickets.push({ resolve, reject });
      });
    }
  }
}
