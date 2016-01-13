import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import values from 'lodash.values';

import RoomItem from '../component/roomItem';

class RoomList extends Component {
  render() {
    const { rooms } = this.props;
    return (
      <div className='room-list-container'>
        <table className='room-list'>
          <thead>
            <tr className='room-item head'>
              <td className='id'>ID</td>
              <td className='lock' />
              <td className='state' />
              <td className='name'>이름</td>
              <td className='host'>방장</td>
              <td className='users'>인원</td>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <RoomItem key={room.id} room={room} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

RoomList.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string
  })).isRequired
};

export default connect(
  state => ({
    rooms: values(state.room.list)
  })
)(RoomList);
