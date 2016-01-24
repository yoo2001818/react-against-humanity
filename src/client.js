import './style/index.scss';

import 'es5-shim';
import 'es6-shim';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncHistory } from 'redux-simple-router';

import routes from './view/routes';

import WebSocketClientConnector from './utils/connector/webSocketClient';
import clientRouter from './router/client';

import connectorMiddleware from './store/middleware/connector';
import reducer from './reducer/client';

let createStore = require('./store/configureStore').default;
if (__DEVTOOLS__) createStore = require('./store/configureStore.dev').default;

import { autoDetectLocale } from './lang';

autoDetectLocale();

let connector = new WebSocketClientConnector(
  clientRouter, {}, 'ws://' + window.location.host + '/');

const history = createBrowserHistory();

let reduxRouterMiddleware = syncHistory(history);

let store = createStore(undefined, [
  connectorMiddleware(connector),
  reduxRouterMiddleware
], reducer);
connector.store = store;
connector.reconnect();

reduxRouterMiddleware.listenForReplays(store);

// If devTools is enabled, show popup.
if (__DEVTOOLS__) require('./utils/showDevTools').default(store);

// Create wrapper element...

let wrapper = document.createElement('div');
wrapper.className = 'appContainer';
document.body.appendChild(wrapper);

render(
  <Provider store={store}>
    <Router history={history}>
      { routes }
    </Router>
  </Provider>,
  wrapper
);
