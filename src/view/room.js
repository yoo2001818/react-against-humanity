import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AppContainer from '../container/appContainer';
import PlayerList from '../container/room/playerList';
import RoomForm from '../container/form/roomForm';

import { routeActions as RouteActions } from 'redux-simple-router';
import * as RoomActions from '../action/room';

export default class Room extends Component {
  handleJoin(e) {
    this.props.dispatch(RoomActions.join(this.props.room.id));
    e.preventDefault();
  }
  handleLeave(e) {
    this.props.dispatch(RoomActions.leave())
    .then(() => this.props.dispatch(RouteActions.push('/')));
    e.preventDefault();
  }
  handleFormEdit(values) {
    this.props.dispatch(RoomActions.update(values, this.props.room.id));
  }
  render() {
    const { room, connectionId } = this.props;
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
                className='dialog' roomId={room.id} roomView
                inRoom={room.users.indexOf(connectionId) !== -1}
                canEdit={room.host === connectionId}
                readonly={room.host !== connectionId}
                onSubmit={this.handleFormEdit.bind(this)}
                onLeave={this.handleLeave.bind(this)}
                onJoin={this.handleJoin.bind(this)}
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
  connectionId: PropTypes.number
};

export default connect((state, props) => {
  const { room: { list }, connection: { self } } = state;
  const { params: { roomId } } = props;
  const room = list[roomId];
  return { room, connectionId: self };
})(Room);
