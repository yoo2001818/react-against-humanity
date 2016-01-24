import React from 'react';

import { IndexRoute, Route } from 'react-router';
import App from './app';
import Lobby from './lobby';
import Room from './room';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Lobby} />
    <Route path='room'>
      <IndexRoute component={Lobby} />
      <Route path=':roomId' component={Room} />
    </Route>
  </Route>
);
