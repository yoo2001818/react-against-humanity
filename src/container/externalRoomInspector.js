import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import __ from '../lang';

import * as roomActions from '../action/room';

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
  handleJoin() {
    this.props.onJoin(this.props.room.id);
  }
  handleLeave() {
    this.props.onLeave(this.props.room.id);
  }
  handleSpectate() {
    // WIP
  }
  render() {
    const { room, joined, joinedOther } = this.props;
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
        {joined && <KeyValue title=''>{__('AlreadyJoinedRoom')}</KeyValue>}
        <RoomActionBar noDetails joined={joined} joinedOther={joinedOther}
          onJoin={this.handleJoin.bind(this)}
          onLeave={this.handleLeave.bind(this)}
          onSpectate={this.handleSpectate.bind(this)}
        />
      </Entry>
    );
  }
}

ExternalRoomInspector.propTypes = {
  room: PropTypes.object,
  id: PropTypes.number,
  joined: PropTypes.bool,
  joinedOther: PropTypes.bool,
  onJoin: PropTypes.func,
  onLeave: PropTypes.func
};

export default connect((state, props) => {
  const connection = state.connection.list[state.connection.self];
  const { room: { list } } = state;
  const { id } = props;
  return {
    room: list[id],
    joined: connection && connection.roomId === id,
    joinedOther: connection && connection.roomId != null
  };
}, {
  onJoin: roomActions.join,
  onLeave: roomActions.leave
})(ExternalRoomInspector);
