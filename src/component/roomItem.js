import React, { Component, PropTypes } from 'react';

import classNames from 'classnames';

export default class RoomItem extends Component {
  render() {
    const { room } = this.props;
    return (
      <tr className='room-item'>
        <td className='id'>
          {room.id}
        </td>
        <td className={classNames('lock', {enabled: room.locked})} />
        <td className={classNames('state', {
          playing: room.playing,
          waiting: !room.playing
        })} />
        <td className='name'>
          {room.name}
        </td>
        <td className='host'>
          {room.host || '끼로'}
        </td>
        <td className='users'>
          <span className='current'>
            {room.playerCount || 1}
          </span>
          <span className='max'>
            {room.maxPlayerCount || 1}
          </span>
        </td>
      </tr>
    );
  }
}

RoomItem.propTypes = {
  room: PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string
  })
};
