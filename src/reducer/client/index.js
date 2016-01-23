import { routeReducer } from 'redux-simple-router';

import commonReducer from '../common';
import error from './error';
import transport from './transport';

export default Object.assign({},
  {
    error, transport, routing: routeReducer
  },
  commonReducer
);
