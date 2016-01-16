import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Entry from '../component/sidebar/entry';
import RoomInspector from '../component/roomInspector';
import RoomActionBar from '../component/roomActionBar';

class KeyValue extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <div className='keyvalue'>
        <div className='header'>{title}</div>
        <div className='content'>
          {children}
        </div>
      </div>
    );
  }
}

KeyValue.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node
};

export default class ExternalRoomInspector extends Component {
  render() {
    const { room } = this.props;
    if (room == null) {
      return (
        <Entry hideHeader>
          선택한 방이 없습니다.
        </Entry>
      );
    }
    return (
      <Entry title={room.name} className='external-room-inspector'>
        <KeyValue title='방장'>{room.host}</KeyValue>
        <RoomInspector room={room} showCount />
        <RoomActionBar noDetails />
      </Entry>
    );
  }
}

ExternalRoomInspector.propTypes = {
  room: PropTypes.object,
  id: PropTypes.number
};

export default connect((state, props) => {
  const { room: { list } } = state;
  const { id } = props;
  return {
    room: list[id]
  };
})(ExternalRoomInspector);
