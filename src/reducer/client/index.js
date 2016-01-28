import { routeReducer } from 'redux-simple-router';

import commonReducer from '../common';
import error from './error';
import transport from './transport';
import sidebar from './sidebar';
import chatTab from './chatTab';

export default Object.assign({},
  {
    error, transport, sidebar, chatTab, routing: routeReducer
  },
  commonReducer
);
