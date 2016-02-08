import * as Gameplay from '../../action/gameplay';
import Router from '../../utils/router';
import setConnection from '../middleware/setConnection';
import passThrough from '../middleware/passThrough';
import checkRoomHost from '../middleware/checkRoomHost';

import { getQuestion, getAnswer } from '../../db/deck';

const router = new Router();

// Poll events

// Only hosts can submit these actions.
router.poll(Gameplay.START, setConnection, checkRoomHost, passThrough);
router.poll(Gameplay.STOP, setConnection, checkRoomHost, passThrough);
// Gameplay actions
router.poll(Gameplay.SUBMIT, setConnection, passThrough);
router.poll(Gameplay.SELECT, setConnection, passThrough);

// Middleware events; we need to intercept the game reducer.
router.middleware(Gameplay.START, (req, next) => {
  // First we need to run the start action first.
  let original = next();
  // Pull random question card, then emit the action.
  let card = getQuestion();
  // Done! I think.
  req.store.dispatch(Gameplay.phaseSubmit(card, req.action.meta.target.room));
  return original;
});
router.middleware(Gameplay.PHASE_SUBMIT, (req, next) => {
  let original = next();
  const roomId = req.action.meta.target.room;
  const { room: { list } } = req.store.getState();
  const room = list[roomId];
  const { userList, users } = room.gameplay;
  // For each player, retrieve missing cards.
  for (let userId of userList) {
    const userInfo = users[userId];
    const missingCards = 10 - userInfo.cards.length;
    if (missingCards > 0) {
      // Deploy cards.
      let cards = getAnswer(missingCards);
      // TODO we need to hide this information from other users - everyone
      // other than the receiver.
      req.store.dispatch(Gameplay.draw(userId, cards, roomId));
    }
  }
  return original;
});
router.middleware(Gameplay.PHASE_END, (req, next) => {
  let original = next();
  // Nothing to do here actually. Wait 4s and continue.
  setTimeout(() => {
    let card = getQuestion();
    const roomId = req.action.meta.target.room;
    req.store.dispatch(Gameplay.phaseSubmit(card, roomId));
  }, 4000);
  return original;
});
router.middleware(Gameplay.SUBMIT, (req, next) => {
  let original = next();
  const roomId = req.action.meta.target.room;
  const { room: { list } } = req.store.getState();
  const room = list[roomId];
  const { answerCardCount, answerCards, userList } = room.gameplay;
  if (answerCardCount >= userList.length - 1) {
    // Done! now let's emit phaseSelect action.
    req.store.dispatch(Gameplay.phaseSelect(answerCards, roomId));
  }
  return original;
});
router.middleware(Gameplay.SELECT, (req, next) => {
  let original = next();
  req.store.dispatch(Gameplay.phaseEnd(req.action.meta.target.room));
  return original;
});

export default router;
