import { combineReducers } from 'redux';

import connection from './connection';
import subChat from './subChat';
import room from './room';
import transport from './transport';
import error from './error';

export default combineReducers({
  connection, chat: subChat, room, transport, error
});
