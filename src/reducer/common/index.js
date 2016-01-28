import connection from './connection';
import chatFilter from './chatFilter';
import room from './room';

export default {
  connection, chat: chatFilter('global'), room
};
