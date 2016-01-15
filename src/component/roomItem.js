import React, { Component, PropTypes } from 'react';

import classNames from 'classnames';

export default class RoomItem extends Component {
  render() {
    const { room } = this.props;
    return (
      <li className='room-item'>
        <div className='header'>
          <div className='name'>
            <div className={classNames('state', {
              playing: room.playing,
              waiting: !room.playing
            })} />
            {room.name}
            <div className={classNames('lock', {enabled: room.locked})} />
          </div>
          <div className='status'>
            <div className='host'>
              {room.host || '끼로'}
            </div>
            <div className='users'>
              <span className='current'>
                {room.playerCount || 1}
              </span>
              <span className='max'>
                {room.maxPlayerCount || 1}
              </span>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

RoomItem.propTypes = {
  room: PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string
  })
};
