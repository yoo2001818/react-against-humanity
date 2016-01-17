// WebSocket client; Connects to a WebSocket server.
import Connector from './index';
// WebSocket MUST be supported by web browsers.
// import WebSocket from 'ws';
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
      const packet = parseJSON(dataString);
      if (packet instanceof Error) {
        debug('JSON parsing error while receiving');
        // Or not. :P Just ignore it if this happens.
      } else {
        let { action, ticketRes, ticketReq } = packet;
        // Resolve action and finish if ticket is set.
        if (ticketRes !== undefined) {
          if (!Number.isInteger(ticketRes) || this.tickets[ticketRes] == null) {
            debug('wrong ticketResponse received; dropping');
            debug(action);
            return;
          }
          debug('resolving ticket ' + ticketRes);
          this.tickets[ticketRes].resolve(action);
          return;
        }
        if (ticketReq !== undefined) {
          debug('handling ticketRequest ' + ticketReq);
          this.handle(action, -1)
          .then(action => {
            debug('replying ticket ' + ticketReq);
            return this.dispatch(action, -1, null, ticketReq);
          }, error => {
            debug(error.stack);
            debug('replying ticket' + ticketReq + ' with an error');
            return this.dispatch(Object.assign({}, action, {
              payload: (error instanceof Error) ? {
                stack: error.stack,
                message: error.message
              } : error,
              error: true
            }), -1, null, ticketReq);
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

  dispatch(action, connection, ticketReq, ticketRes) {
    // Ignore connection; It's only for the server.
    let packet = { action };
    // Inject ticket number, this one is verbose one.
    if (ticketRes != null) packet.ticketRes = ticketRes;
    // However this won't do anything if 'true' is not given, this will just
    // send raw ticket request without handling it.
    if (ticketReq != null) packet.ticketReq = ticketReq;
    // Inject ticket number if Promise is required.
    if (ticketReq === true) {
      debug('sending message with ticket ' + this.tickets.length);
      packet.ticketReq = this.tickets.length;
    } else {
      debug('sending message');
    }
    // Serialize action data.
    const dataString = JSON.stringify(packet);
    // Send it...
    this.socket.send(dataString);
    if (ticketReq === true) {
      // Register ticket if ticket is available.
      return new Promise((resolve, reject) => {
        this.tickets.push({ resolve, reject });
      });
    }
  }
}
