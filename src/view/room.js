import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as RoomActions from '../action/room';

export default class Room extends Component {
  dispatchTest() {
    // It's not necessary to set the current room value.
    this.props.dispatch(RoomActions.leave());
  }
  render() {
    const { room } = this.props;
    return (
      <div>
        <h1>{`#${room.id} ${room.name}`}</h1>
        <button onClick={this.dispatchTest.bind(this)}>방 나가기</button>
      </div>
    );
  }
}

Room.propTypes = {
  dispatch: PropTypes.func.isRequired,
  room: PropTypes.object
};

export default connect((state, props) => {
  const { room: { list } } = state;
  const { id } = props;
  return {
    room: list[id]
  };
})(Room);
