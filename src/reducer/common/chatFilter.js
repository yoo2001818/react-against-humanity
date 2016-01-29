import subChat from './subChat';
import * as ConnectionActions from '../../action/connection';

export default function chatFilter(filter = 'global', filterActions = [
  ConnectionActions.HANDSHAKE,
  ConnectionActions.CONNECT,
  ConnectionActions.DISCONNECT,
  ConnectionActions.LOGIN,
  ConnectionActions.LOGOUT
]) {
  return (state, action) => {
    if (action.meta && action.meta.scope === filter) {
      return subChat(state, action);
    }
    if (filterActions.indexOf(action.type) !== -1) {
      return subChat(state, action);
    }
    // If state is null, process it anyway
    if (state == null) return subChat(state, action);
    return state;
  };
}
