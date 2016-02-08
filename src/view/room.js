import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AppContainer from '../container/appContainer';
import PlayerList from '../container/room/playerList';
import RoomForm from '../container/form/roomForm';
import RoomActionForm from '../container/form/roomActionForm';

import { routeActions as RouteActions } from 'redux-simple-router';
import * as RoomActions from '../action/room';
import * as GameplayActions from '../action/gameplay';

export default class Room extends Component {
  handleJoin(data) {
    const { connection, room, dispatch } = this.props;
    if (!connection || connection.level === 'anonymous') {
      return Promise.resolve();
    }
    return dispatch(RoomActions.join(room.id, data));
  }
  handleLeave(e) {
    this.props.dispatch(RoomActions.leave())
    .then(() => this.props.dispatch(RouteActions.push('/')));
    e.preventDefault();
  }
  handleStart(e) {
    const { connection, room, dispatch } = this.props;
    if (!connection || connection.id !== room.host) {
      return Promise.resolve();
    }
    dispatch(GameplayActions.start());
    e.preventDefault();
  }
  handleFormEdit(values) {
    this.props.dispatch(RoomActions.update(values, this.props.room.id));
  }
  render() {
    const { room, connection } = this.props;
    if (room == null) {
      return (
        <AppContainer title='404'>
          <div>Such room doesn't exist.</div>
        </AppContainer>
      );
    }
    return (
      <AppContainer title={room.name}>
        <div className='room-view two-column-view'>
          <div className='details-column'>
            <div className='details-dialog'>
              <RoomForm initialValues={room} formKey={'id/'+room.id}
                className='dialog' room={room} roomView
                inRoom={room.users.indexOf(connection && connection.id) !== -1}
                canEdit={room.host === (connection && connection.id)}
                onSubmit={this.handleFormEdit.bind(this)}
              />
              <RoomActionForm room={room}
                joined={room.users.indexOf(connection && connection.id) !== -1}
                canJoin={connection && connection.level !== 'anonymous'}
                onLeave={this.handleLeave.bind(this)}
                onJoin={this.handleJoin.bind(this)}
                onStart={this.handleStart.bind(this)}
                canStart={room.host === (connection && connection.id)}
              />
            </div>
          </div>
          <div className='list-column'>
            <PlayerList room={room} />
          </div>
        </div>
      </AppContainer>
    );
  }
}

Room.propTypes = {
  dispatch: PropTypes.func.isRequired,
  room: PropTypes.object,
  connection: PropTypes.object
};

export default connect((state, props) => {
  const { room: { list }, connection: { self, list: connectionList } } = state;
  const { params: { roomId } } = props;
  const room = list[roomId];
  const connection = connectionList[self];
  return { room, connection };
})(Room);
