import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import values from 'lodash.values';

import RoomItem from '../component/roomItem';
import __ from '../lang';

class RoomList extends Component {
  handleSelect(id) {
    const { onSelect } = this.props;
    return onSelect && onSelect(id);
  }
  render() {
    const { rooms, selected } = this.props;
    return (
      <ul className='room-list'>
        {rooms.map(room => (
          <RoomItem key={room.id}
            room={room}
            selected={room.id === selected}
            onSelect={this.handleSelect.bind(this, room.id)}
          />
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
  })).isRequired,
  selected: PropTypes.number,
  onSelect: PropTypes.func
};

export default connect(
  state => ({
    rooms: values(state.room.list)
  })
)(RoomList);
