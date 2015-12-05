import WebSocketClientConnector from './utils/connector/webSocketClient';
import logger from './router/middleware/logger';

let connector = new WebSocketClientConnector( // eslint-disable-line
  logger, {}, 'ws://localhost:8000/');
