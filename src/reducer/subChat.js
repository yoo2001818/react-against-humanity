import * as ChatActions from '../action/chat';
import * as ConnectionActions from '../action/connection';

export default function subChat(state = {
  limit: 100,
  messages: []
}, action) {
  const { limit, messages } = state;
  const { type, payload, meta } = action;
  switch (type) {
  case ChatActions.CHAT:
    return Object.assign({}, state, {
      messages: messages.concat([{
        connection: meta.connection,
        type: 'normal',
        message: payload.message
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
  case ConnectionActions.CONNECT:
    return Object.assign({}, state, {
      messages: messages.concat([{
        connection: meta.connection,
        type: 'join'
      }]).slice(-limit)
    });
  case ConnectionActions.DISCONNECT:
    return Object.assign({}, state, {
      messages: messages.concat([{
        connection: meta.connection,
        type: 'leave'
      }]).slice(-limit)
    });
  }
  return state;
}
