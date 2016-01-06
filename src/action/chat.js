import { createAction } from 'redux-actions';

export const CHAT = 'chat/chat';
export const CLEAR_HISTORY = 'chat/clearHistory';
export const SET_LIMIT = 'chat/setLimit';

export const chat = createAction(CHAT,
  (scope, message) => ({ message, scope }),
  () => ({
    class: 'write', noWait: true
  })
);
export const clearHistory = createAction(CLEAR_HISTORY,
  (scope) => ({ scope }),
  () => ({ noWait: true })
);
export const setLimit = createAction(SET_LIMIT,
  (scope, limit) => ({ scope, limit }),
  () => ({ noWait: true })
);
