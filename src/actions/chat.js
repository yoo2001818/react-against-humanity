import { createAction } from 'redux-actions';

export const CHAT = 'chat/chat';
export const CLEAR_HISTORY = 'chat/clearHistory';

export const chat = createAction(CHAT);
export const clearHistory = createAction(CLEAR_HISTORY);
