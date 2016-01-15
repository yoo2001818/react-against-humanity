import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import values from 'lodash.values';

import RoomItem from '../component/roomItem';
import __ from '../lang';

class RoomList extends Component {
  render() {
    const { rooms } = this.props;
    return (
      <ul className='room-list'>
        {rooms.map(room => (
          <RoomItem key={room.id} room={room} />
        ))}
        {rooms.length === 0 && (
          <div className='no-room-msg'>
            <div className='icon' />
            <p className='message'>
              {__('RoomListEmptyMsg')}
            </p>
          </div>
        )}
      </ul>
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
