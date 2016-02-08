import { createAction } from 'redux-actions';

// Game start/stop actions.
export const START = 'gameplay/start';
export const STOP = 'gameplay/stop';

// Phase related actions.
// Czar draws question card; Users submit answer cards.
export const PHASE_SUBMIT = 'gameplay/phaseSubmit';
// Czar selects the answer card.
export const PHASE_SELECT = 'gameplay/phaseSelect';
// A turn is over; score the winner and pass the czar.
export const PHASE_END = 'gameplay/phaseEnd';

// Card related actions.
// User draw cards.
export const DRAW = 'gameplay/draw';
// User submits answer cards.
export const SUBMIT = 'gameplay/submit';
// Czar selects the anwser card.
export const SELECT = 'gameplay/select';

function classWrite() {
  return { class: 'write' };
}

function noop() {
}

export const start = createAction(START, noop, classWrite);
export const stop = createAction(STOP, noop, classWrite);

export const phaseSubmit = createAction(PHASE_SUBMIT,
  questionCard => questionCard, (_, room) => ({
    class: 'write',
    target: { room }
  }));
export const phaseSelect = createAction(PHASE_SELECT,
  answerCards => answerCards, (_, room) => ({
    class: 'write',
    target: { room }
  }));
export const phaseEnd = createAction(PHASE_END, noop, room => ({
  class: 'write',
  target: { room }
}));

export const draw = createAction(DRAW, (user, cards) => ({user, cards}),
  (_, _2, room) => ({
    class: 'write',
    target: { room }
  }));
export const submit = createAction(SUBMIT, cards => cards, classWrite);
export const select = createAction(SELECT, cards => cards, classWrite);
