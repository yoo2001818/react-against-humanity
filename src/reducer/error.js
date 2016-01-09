import { DISMISS } from '../action/error';

export default function error(state = {
  enabled: false,
  message: null,
  stack: null,
  type: null
}, action) {
  const { type, payload, error } = action;
  if (type === DISMISS) {
    return Object.assign({}, state, {
      enabled: false
    });
  }
  if (error) {
    return Object.assign({}, state, payload, {
      enabled: true,
      type: type
    });
  }
  return state;
}
