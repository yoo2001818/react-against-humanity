import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import values from 'lodash.values';

import { routeActions as RouteActions } from 'redux-simple-router';
import * as RoomActions from '../action/room';

import RoomItem from '../component/roomItem';
import __ from '../lang';

class RoomList extends Component {
  handleSelect(id) {
    const { onSelect } = this.props;
    return onSelect && onSelect(id);
  }
  handleJoin(room, e) {
    if (this.props.level === 'anonymous') return e.preventDefault();
    this.props.dispatch(RoomActions.join(room.id))
      .then(() => this.props.dispatch(RouteActions.push(`/room/${room.id}`)));
    e.preventDefault();
  }
  handleLeave(room) {
    this.props.dispatch(RoomActions.leave(room.id));
  }
  handleSpectate() {
    // WIP
  }
  render() {
    const { rooms, selected, joined, level } = this.props;
    return (
      <ul className='room-list'>
        {rooms.map(room => (
          <RoomItem key={room.id}
            room={room}
            selected={room.id === selected}
            joined={room.id === joined}
            canJoin={level !== 'anonymous'}
            onSelect={this.handleSelect.bind(this, room.id)}
            onJoin={this.handleJoin.bind(this, room)}
            onLeave={this.handleLeave.bind(this, room)}
            onSpectate={this.handleSpectate.bind(this, room)}
          />
        ))}
        {rooms.length === 0 && (
          <div className='no-room-msg'>
            <div className='icon' />
            <p className='message'>
              {level === 'anonymous' ?
                __('RoomListEmptyMsgAnonymous') :
                __('RoomListEmptyMsg')
              }
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
  joined: PropTypes.number,
  level: PropTypes.string,
  onSelect: PropTypes.func,
  dispatch: PropTypes.func
};

export default connect(
  state => {
    const connectionList = state.connection.list;
    const connection = connectionList[state.connection.self];
    return {
      rooms: values(state.room.list).map(room => Object.assign({}, room, {
        host: connectionList[room.host],
        users: room.users.map(id => connectionList[id])
      })),
      joined: connection && connection.roomId,
      level: connection && connection.level
    };
  }
)(RoomList);
