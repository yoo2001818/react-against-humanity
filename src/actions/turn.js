import { createAction } from 'redux-actions';

export const NEXT = 'turn/next';
export const DRAW = 'turn/draw';
export const SUBMIT = 'turn/submit';
export const CHOOSE = 'turn/choose';

export const next = createAction(NEXT);
export const draw = createAction(DRAW);
export const submit = createAction(SUBMIT);
export const choose = createAction(CHOOSE);
