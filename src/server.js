import http from 'http';
import { Server as WebSocketServer } from 'ws';
import express from 'express';
import serveStatic from 'serve-static';

import WebSocketServerConnector from './utils/connector/webSocketServer';
import serverRouter from './router/server';

import createStore from './store';

/* eslint-disable no-console */

const httpServer = http.createServer();
const wss = new WebSocketServer({
  server: httpServer
});

const app = express();
app.use(serveStatic('./dist'));
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>React against Humanity</title>
      </head>
      <body>
        <script src="bundle.js"></script>
      </body>
    </html>
  `);
});

httpServer.on('request', app);
httpServer.listen(8000, () => {
  console.log('Listening on ' + httpServer.address().port);
});

let connector = new WebSocketServerConnector(serverRouter, {}, wss);

let store = createStore(undefined, connector);
connector.store = store;
