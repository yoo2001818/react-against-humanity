import WebSocketClientConnector from './utils/connector/webSocketClient';
import clientRouter from './router/client';

import createStore from './store';

let connector = new WebSocketClientConnector(
  clientRouter, {}, 'ws://localhost:8000/');

let store = createStore(undefined, connector);
connector.store = store;
