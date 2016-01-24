import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import __ from '../lang';

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
    const { room, joined } = this.props;
    if (room == null) {
      return (
        <Entry hideHeader>
          {__('NoRoomSelectedMsg')}
        </Entry>
      );
    }
    return (
      <Entry title={room.name} className='external-room-inspector'>
        <KeyValue title={__('RoomHost')}>{room.host}</KeyValue>
        <RoomInspector room={room} showCount />
        <KeyValue title=''>{__('AlreadyJoinedRoom')}</KeyValue>
        <RoomActionBar noDetails joined={joined} />
      </Entry>
    );
  }
}

ExternalRoomInspector.propTypes = {
  room: PropTypes.object,
  id: PropTypes.number,
  joined: PropTypes.bool
};

export default connect((state, props) => {
  const connection = state.connection.list[state.connection.self];
  const { room: { list } } = state;
  const { id } = props;
  return {
    room: list[id],
    joined: connection && connection.roomId === id
  };
})(ExternalRoomInspector);
