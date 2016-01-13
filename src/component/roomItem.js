import React, { Component, PropTypes } from 'react';

export default class RoomItem extends Component {
  render() {
    const { room } = this.props;
    return (
      <tr className='room-item'>
        <td className='id'>
          {room.id}
        </td>
        <td className='lock' />
        <td className='state waiting' />
        <td className='name'>
          {room.name}
        </td>
        <td className='host'>
          끼로
        </td>
        <td className='users'>
          <span className='current'>
            1
          </span>
          <span className='max'>
            6
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
