import * as TransportActions from '../action/transport';
import * as ConnectionActions from '../action/connection';

export default function connection(state = {
  self: null,
  list: {}
}, action) {
  const { list } = state;
  const { type, payload, error } = action;
  if (error) return state;
  switch (type) {
  case ConnectionActions.CONNECT:
    if (list[payload.id] !== undefined) {
      throw new Error(`Connection ${payload.id} is already occupied`);
    }
    return Object.assign({}, state, {
      list: Object.assign({}, list, {
        [payload.id]: payload
      })
    });
  case ConnectionActions.DISCONNECT:
    if (list[payload.id] === undefined) {
      throw new Error(`Connection ${payload.id} is not available`);
    }
    return Object.assign({}, state, {
      list: (() => {
        let newList = Object.assign({}, list);
        delete newList[payload.id];
        return newList;
      })()
    });
  case ConnectionActions.UPDATE:
    if (list[payload.id] === undefined) {
      throw new Error(`Connection ${payload.id} is not available`);
    }
    return Object.assign({}, state, {
      list: Object.assign({}, list, {
        [payload.id]: Object.assign({}, list[payload.id], payload)
      })
    });
  case ConnectionActions.HANDSHAKE:
    return payload.connection;
  case TransportActions.CREATE:
    return Object.assign({}, state, {
      self: null
    });
  }
  return state;
}
