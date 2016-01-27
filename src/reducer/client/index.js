import { routeReducer } from 'redux-simple-router';

import commonReducer from '../common';
import error from './error';
import transport from './transport';
import sidebar from './sidebar';

export default Object.assign({},
  {
    error, transport, sidebar, routing: routeReducer
  },
  commonReducer
);
