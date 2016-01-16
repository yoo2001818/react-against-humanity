import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import RoomActionBar from './roomActionBar';

export default class RoomItem extends Component {
  render() {
    const { room, selected, onSelect = () => {} } = this.props;
    return (
      <li
        className={classNames('room-item', { selected })}
        onClick={onSelect}
      >
        <div className='thumb'>
          <div className={classNames('state', {
            playing: room.playing,
            waiting: !room.playing
          })} />
        </div>
        <div className='header'>
          <div className='name'>
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
        { selected && <RoomActionBar /> }
      </li>
    );
  }
}

RoomItem.propTypes = {
  room: PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string
  }),
  onSelect: PropTypes.func,
  selected: PropTypes.bool
};
