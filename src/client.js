import './style/index.scss';

import 'es5-shim';
import 'es6-shim';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistory } from 'redux-simple-router';

import routes from './view/routes';

import WebSocketClientConnector from './utils/connector/webSocketClient';
import clientRouter from './router/client';

import connectorMiddleware from './store/middleware/connector';
import reducer from './reducer/client';
import createStore from './store';

import { autoDetectLocale } from './lang';

autoDetectLocale();

let connector = new WebSocketClientConnector(
  clientRouter, {}, 'ws://' + window.location.host + '/');

let reduxRouterMiddleware = syncHistory(browserHistory);

let store = createStore(undefined, [
  connectorMiddleware(connector),
  reduxRouterMiddleware
], reducer);
connector.store = store;
connector.reconnect();

reduxRouterMiddleware.listenForReplays(store);

// Create wrapper element...

let wrapper = document.createElement('div');
wrapper.className = 'appContainer';
document.body.appendChild(wrapper);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      { routes }
    </Router>
  </Provider>,
  wrapper
);
