import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AppContainer from '../container/appContainer';

import { routeActions } from 'redux-simple-router';
import * as roomActions from '../action/room';

export default class Room extends Component {
  dispatchTest() {
    // It's not necessary to set the current room value.
    this.props.dispatch(roomActions.leave())
    .then(() => this.props.dispatch(routeActions.push('/')));
  }
  render() {
    const { room } = this.props;
    if (room == null) {
      return (
        <AppContainer title='404'>
          <div>Such room doesn't exist.</div>
        </AppContainer>
      );
    }
    return (
      <AppContainer title={room.name}>
        <div>
          <h1>{`#${room.id} ${room.name}`}</h1>
          <button onClick={this.dispatchTest.bind(this)}>방 나가기</button>
        </div>
      </AppContainer>
    );
  }
}

Room.propTypes = {
  dispatch: PropTypes.func.isRequired,
  room: PropTypes.object
};

export default connect((state, props) => {
  const { room: { list } } = state;
  const { params: { roomId } } = props;
  return {
    room: list[roomId]
  };
})(Room);
