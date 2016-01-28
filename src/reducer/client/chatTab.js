import { OPEN, CLOSE, TOGGLE, SELECT } from '../../action/chatTab';

export default function chatTab(state = {
  open: false,
  selected: 0
}, action) {
  const { type, payload } = action;
  switch (type) {
  case OPEN:
    return Object.assign({}, state, {
      open: true
    });
  case CLOSE:
    return Object.assign({}, state, {
      open: false
    });
  case TOGGLE:
    return Object.assign({}, state, {
      open: !state.open
    });
  case SELECT:
    return Object.assign({}, state, {
      open: true,
      selected: payload
    });
  }
  return state;
}
