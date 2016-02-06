import http from 'http';
import { Server as WebSocketServer } from 'ws';
import express from 'express';
import serveStatic from 'serve-static';
import { sessionMiddleware } from './db/session';

import WebSocketServerConnector from './utils/connector/webSocketServer';
import serverRouter from './router/server';

import connectorMiddleware from './store/middleware/connector';
import reducer from './reducer/server';
import createStore from './store/configureStore';

import networkConfig from '../config/network.config';

/* eslint-disable no-console */

const httpServer = http.createServer();
const wss = new WebSocketServer({
  server: httpServer
});

const app = express();

if (__DEVELOPMENT__) {
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.js');
  let compiler = webpack(webpackConfig);
  app.use(webpackHotMiddleware(compiler, {
    log: null, heartbeat: 10 * 1000
  }));
  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/assets'
  }));
} else {
  app.use('/assets', serveStatic('./dist'));
}

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(404);
});

app.use(sessionMiddleware, (req, res) => {
  // Some dummy value to set the session
  req.session.lastIndexAccess = new Date().valueOf();
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="UTF-8">
        <title>React against Humanity</title>
      </head>
      <body>
        <script src="/assets/bundle.js"></script>
      </body>
    </html>
  `);
});

httpServer.on('request', app);
httpServer.listen(networkConfig.port, networkConfig.listen, () => {
  console.log('Listening on ' + httpServer.address().port);
});

let connector = new WebSocketServerConnector(serverRouter, {}, wss);

let store = createStore(undefined, [
  connectorMiddleware(connector)
], reducer);
connector.store = store;
