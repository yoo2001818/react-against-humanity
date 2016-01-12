import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as RoomActions from '../action/room';
import RoomList from './roomList';
// import __ from '../lang';

export default class Lobby extends Component {
  dispatchTest() {
    // Hmm.
    this.props.dispatch(RoomActions.create({
      name: '괴상한 방'
    }));
  }
  render() {
    return (
      <div>
        <RoomList />
        <button onClick={this.dispatchTest.bind(this)}>방 만들기</button>
      </div>
    );
  }
}

Lobby.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(() => ({}))(Lobby);
