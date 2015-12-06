import WebSocketClientConnector from './utils/connector/webSocketClient';
import clientRouter from './router/client';

let connector = new WebSocketClientConnector( // eslint-disable-line
  clientRouter, {}, 'ws://localhost:8000/');
