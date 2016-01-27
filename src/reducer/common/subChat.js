import * as ChatActions from '../../action/chat';
import * as ConnectionActions from '../../action/connection';

export default function subChat(state = {
  limit: 100,
  messages: []
}, action) {
  const { limit, messages } = state;
  const { type, payload, meta, error } = action;
  if (error) return state;
  let connection;
  if (meta &&
    meta.state && meta.state.connection && meta.state.connection.list &&
    meta.target && meta.target.connection
  ) {
    connection = meta.state.connection.list[meta.target.connection];
  }
  switch (type) {
  case ChatActions.CHAT:
    if (connection.level === 'anonymous') {
      throw new Error('Anonymous connection cannot chat');
    }
    return Object.assign({}, state, {
      messages: messages.concat([{
        connection: connection,
        type: 'normal',
        message: payload.message,
        date: meta.date
      }]).slice(-limit)
    });
  case ConnectionActions.CONNECT:
  case ConnectionActions.LOGIN:
    if (payload.level == null || payload.level === 'anonymous') return state;
    return Object.assign({}, state, {
      messages: messages.concat([{
        connection: payload,
        type: 'join',
        date: meta.date
      }]).slice(-limit)
    });
  case ConnectionActions.DISCONNECT:
  case ConnectionActions.LOGOUT:
    if (connection.level === 'anonymous') return state;
    return Object.assign({}, state, {
      messages: messages.concat([{
        connection: connection,
        type: 'leave',
        date: meta.date
      }]).slice(-limit)
    });
  case ChatActions.CLEAR_HISTORY:
    return Object.assign({}, state, {
      messages: []
    });
  case ChatActions.SET_LIMIT:
    return Object.assign({}, state, {
      limit: payload.limit
    });
  case ConnectionActions.HANDSHAKE:
    return payload.chat;
  }
  return state;
}
