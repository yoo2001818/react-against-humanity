import { createAction } from 'redux-actions';

export const CHAT = 'chat/chat';
export const CLEAR_HISTORY = 'chat/clearHistory';
export const SET_LIMIT = 'chat/setLimit';

export const chat = createAction(CHAT,
  (_, message) => ({ message }),
  (scope) => ({
    class: 'write', noWait: true, scope
  })
);
export const clearHistory = createAction(CLEAR_HISTORY,
  () => ({}),
  (scope) => ({ scope })
);
export const setLimit = createAction(SET_LIMIT,
  (_, limit) => ({ limit }),
  (scope) => ({ scope })
);
