import { combineReducers } from 'redux';

import connection from './connection';
import subChat from './subChat';
import room from './room';

export default {
  connection, chat: subChat, room
};
