import React, { Component, PropTypes } from 'react';

import AppContainer from '../container/appContainer';

export default class Gameplay extends Component {
  render() {
    const { room, connection } = this.props;
    return (
      <AppContainer title={room.name}>
        <div>
          The game has started! ... I think.
        </div>
        <div>
          {room.gameplay.questionCard && room.gameplay.questionCard.text}
        </div>
        <ul>
          {room.gameplay.users[connection.id].cards.map(card => (
            <li>{card.text}</li>
          ))}
        </ul>
      </AppContainer>
    );
  }
}

Gameplay.propTypes = {
  room: PropTypes.object,
  connection: PropTypes.object
};
