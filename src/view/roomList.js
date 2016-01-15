import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import values from 'lodash.values';

import RoomItem from '../component/roomItem';

class RoomList extends Component {
  render() {
    const { rooms } = this.props;
    return (
      <ul className='room-list'>
        {rooms.map(room => (
          <RoomItem key={room.id} room={room} />
        ))}
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
    // Some 'fake' data to see how it looks.
    rooms: values(state.room.list).concat([{
      id: 1,
      name: '신비한 방',
      host: '인클',
      playerCount: 2,
      maxPlayerCount: 8
    }, {
      id: 2,
      name: '초보만 오세요',
      host: '포풍초보',
      playing: true,
      playerCount: 3,
      maxPlayerCount: 6
    }, {
      id: 3,
      name: '고라니 먹고싶다',
      host: '눉송이',
      playing: true,
      playerCount: 4,
      maxPlayerCount: 8
    }, {
      id: 4,
      name: '매너플레이합시다',
      host: '쪼리핑',
      playerCount: 2,
      maxPlayerCount: 8
    }, {
      id: 5,
      name: 'sdbx',
      locked: true,
      host: '탄라로',
      playerCount: 3,
      maxPlayerCount: 3
    }])
  })
)(RoomList);
