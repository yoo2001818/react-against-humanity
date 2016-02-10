import React, { Component, PropTypes } from 'react';

import AppContainer from '../container/appContainer';
import CardItem from '../component/gameplay/cardItem';

export default class Gameplay extends Component {
  render() {
    const { room, connection } = this.props;
    const { gameplay } = room;
    const currentUser = gameplay.users[connection.id];
    return (
      <AppContainer title={room.name}>
        <div className='gameplay-view two-column-view'>
          <div className='list-column'>
            <CardItem card={gameplay.questionCard} />
          </div>
          <div className='details-column'>
            <div className='details-dialog'>
              {currentUser.cards.map((card, id) => (
                <CardItem card={card} key={id} />
              ))}
            </div>
          </div>
        </div>
      </AppContainer>
    );
  }
}

Gameplay.propTypes = {
  room: PropTypes.object,
  connection: PropTypes.object
};
