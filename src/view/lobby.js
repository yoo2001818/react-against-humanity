import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as RoomActions from '../action/room';
import RoomList from './roomList';
import RightSidebarContainer from '../component/rightSidebarContainer';
import Entry from '../component/sidebar/entry';
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
      <RightSidebarContainer sidebar={(
        <Entry name='Lorem ipsum'>
          A quick brown fox jumps over the lazy dog.
        </Entry>
      )}>
        <RoomList />
        <button onClick={this.dispatchTest.bind(this)}>방 만들기</button>
      </RightSidebarContainer>
    );
  }
}

Lobby.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(() => ({}))(Lobby);
