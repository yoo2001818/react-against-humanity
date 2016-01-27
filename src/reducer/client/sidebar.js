import { OPEN, CLOSE, TOGGLE } from '../../action/sidebar';

export default function sidebar(state = {
  open: false
}, action) {
  const { type } = action;
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
  }
  return state;
}
