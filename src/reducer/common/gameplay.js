import * as GameplayActions from '../../action/gameplay';
import * as RoomActions from '../../action/room';
import * as ConnectionActions from '../../action/connection';

import { updateMap } from './map';
import { addList } from './list';

export default function gameplay(room, state, action) {
  const { type, payload, meta } = action;
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
  // Retrieve connection ID of who initiated the action.
  const connectionId = meta && meta.target && meta.target.connection;
  switch (type) {
  case GameplayActions.START:
    throw new Error('Game already started');
  case GameplayActions.STOP:
    // Remove game state.
    return undefined;
  case GameplayActions.PHASE_SUBMIT:
    // Beginning of a turn, Nothing special really.
    if (state.phase !== 'wait' && state.phase !== 'end') {
      throw new Error('Phase must be wait or end');
    }
    // TODO if users have connected after game start, we need to
    // add them as players in here. However not now.

    // Merge the question card (payload) with the state.
    return Object.assign({}, state, {
      phase: 'submit',
      turn: state.turn + 1,
      questionCard: payload,
      answerCards: [],
      answerCardCount: 0,
      submittedUsers: [],
      selectedAnswer: null
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
      czar: state.userList[
        (state.userList.indexOf(state.czar) + 1) % state.userList.length
      ]
    });
  case GameplayActions.DRAW:
    // Give cards to specific user.
    return Object.assign({}, state, {
      users: updateMap(state.users, payload.user,
        Object.assign({}, state.users[payload.user], {
          cards: state.users[payload.user].cards.concat(payload.cards)
        })
      )
    });
  case GameplayActions.SUBMIT:
    // User submits the card; we get list of card *INDEX*.
    // 'if' clause exists to create its own scope to prevent variable
    // confliction.
    if (payload != null) {
      if (state.phase !== 'submit') {
        throw new Error('Phase must be select');
      }
      // Validate if the user already submitted cards.
      if (state.submittedUsers.indexOf(connectionId) !== -1) {
        throw new Error('You already submitted cards.');
      }
      // Throw error if the user is card czar.
      if (state.czar === connectionId) {
        throw new Error('Card czar is not allowed to submit cards');
      }
      // Pull cards from the card array.
      const user = state.users[connectionId];
      const cards = payload.map(id => user.cards[id]);
      // Validate if all cards exist. Throw error if any of those cards
      // are null.
      if (!cards.every(card => card)) {
        throw new Error('Wrong card specified');
      }
      // Remove cards from user's deck. Since we remove multiple items
      // from the array, it'd be better to work on a copy of the array
      // instance.
      // Note that Array.from is ES6 method; it might be better to use
      // array.slice if ES5 support is required. Although we're using
      // polyfill to resolve that.
      const userCards = Array.from(user.cards);
      payload.forEach(id => userCards.splice(id, 1));
      // That's enough - now let's combine those data into root state.
      // The server router should handle and dispatch phaseSelect action
      // if everyone except the czar has sent cards.
      return Object.assign({}, state, {
        answerCards: addList(state.answerCards, {
          connectionId, cards
        }),
        answerCardCount: state.answerCardCount + 1,
        submittedUsers: addList(state.submittedUsers, connectionId),
        users: updateMap(state.users, connectionId,
          Object.assign({}, user, { cards: userCards })
        )
      });
    }
    // Normally shouldn't reach here, as payload must be provided
    throw new Error('Payload must be specified');
  case GameplayActions.SELECT:
    // Czar selects cards; we get index of answer cards.
    if (payload != null) {
      if (state.phase !== 'select') {
        throw new Error('Phase must be select');
      }
      // Check if the user is the card czar.
      if (state.czar !== connectionId) {
        throw new Error('Only card czar can do this.');
      }
      // The rest is simple. First, validate if specified cards exist.
      if (state.answerCards[payload] == null) {
        throw new Error('Wrong card specified');
      }
      // Then, just inject the selected answer to the state. simple!
      // Of course, server router should emit phaseEnd action.
      return Object.assign({}, state, {
        selectedAnswer: payload
      });
    }
    throw new Error('Payload must be specified');
  case RoomActions.LEAVE:
  case ConnectionActions.DISCONNECT:
  case ConnectionActions.LOGOUT:
  case RoomActions.KICK:
    // TODO Not implemented yet
    // However, we can't continue the game if we don't handle exit event.
    // So.... just entirely stop the game for now.
    return null;
  default:
    return state;
  }
}
