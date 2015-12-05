import { combineReducers } from 'redux';

import connection from './connection';
import subChat from './subChat';

export default combineReducers({
  connection, chat: subChat
});
