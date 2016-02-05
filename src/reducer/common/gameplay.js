import * as GameplayActions from '../../action/gameplay';

import { getMap, updateMap } from './map';
import { addList } from './map';

export default function gameplay(room, state, action) {
  const { type, payload } = action;
  if (state == null) {
    // Silently ignore everything other than START action, although this is
    // not recommended behavior. TODO Add proper error throwing
    if (type === GameplayActions.START) {
      // Start the game; Read the state from room value, inject users, and
      // do other stuff.
      // Server middleware router should treat this as PHASE_SUBMIT, although
      // some are different. But still, server should 'give' cards to users.

      // Do basic check; there must be at least two players in the game!
      // ...Pretty obvious though. Why are we doing this?
      if (room.users.length < 2) {
        throw new Error('There must be at least two players');
      }
      // First czar is *always* first player in the player list. This might be
      // changed, but this is enough for now.
      const czar = room.users[0];
      // Copy user list from the room. This is a list of users actually
      // participating in the game.
      const userList = room.users;
      // Build users table.
      const users = {};
      for (let userId of userList) {
        users[userId] = { id: userId, points: 0, cards: [] };
      }
      return {
        phase: 'wait', turn: 0, czar, userList, users
      };
    }
    return state;
  }
  switch (type) {
  case GameplayActions.START:
    throw new Error('Game already started');
  case GameplayActions.STOP:
    // Remove game state.
    return undefined;
  case GameplayActions.PHASE_SUBMIT:
    // Beginning of a turn, Nothing special really.
    if (state.phase !== 'wait' || state.phase !== 'end') {
      throw new Error('Phase must be wait or end');
    }
    // Merge the question card (payload) with the state.
    return Object.assign({}, state, {
      phase: 'submit',
      turn: state.turn + 1,
      questionCard: payload
    });
  case GameplayActions.PHASE_SELECT:
    // Server initiates this action after all players submit cards.
    // However just setting the state will be fine in here.
    if (state.phase !== 'submit') {
      throw new Error('Phase must be submit');
    }
    return Object.assign({}, state, {
      phase: 'select',
      answerCards: payload
    });
  case GameplayActions.PHASE_END:
    // A turn is over; switch the czar, turn and we're good to go.
    if (state.phase !== 'select') {
      throw new Error('Phase must be select');
    }
    return Object.assign({}, state, {
      phase: 'end',
      czar: (state.userList.indexOf(state.czar) + 1) % state.userList
    });
  case GameplayActions.DRAW:
    // Give cards to specific user.
    return Object.assign({}, state, {
      users: updateMap(room.users, payload.user,
        Object.assign({}, room.users[payload.user], {
          cards: room.users[payload.user].cards.concat(payload.cards)
        })
      )
    });
  case GameplayActions.SUBMIT:
    // User submits the card; we get list of card *INDEX*.
    return state;
  case GameplayActions.SELECT:
    // Czar selects cards; we get index of answer cards.
    return state;
  }
}
