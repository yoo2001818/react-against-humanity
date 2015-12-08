import { combineReducers } from 'redux';

import connection from './connection';
import subChat from './subChat';
import transport from './transport';

export default combineReducers({
  connection, chat: subChat, transport
});
