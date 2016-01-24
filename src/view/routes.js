import React from 'react';

import { IndexRoute, Route } from 'react-router';
import App from './app';
import Lobby from './page/lobby';
import Room from './page/room';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Lobby} />
    <Route path='room'>
      <IndexRoute component={Lobby} />
      <Route path=':roomId' component={Room} />
    </Route>
  </Route>
);
