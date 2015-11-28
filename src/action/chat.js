import { createAction } from 'redux-actions';

export const CHAT = 'chat/chat';
export const CLEAR_HISTORY = 'chat/clearHistory';
export const SET_LIMIT = 'chat/setLimit';

export const chat = createAction(CHAT,
  (scope, _, message) => ({ scope, message }),
  (_, user) => ({ user })
);
export const clearHistory = createAction(CLEAR_HISTORY,
  scope => ({ scope })
);
export const setLimit = createAction(SET_LIMIT,
  (scope, limit) => ({ scope, limit })
);
