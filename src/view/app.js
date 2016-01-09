import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import ConnectionKeeper from './connectionKeeper';
import ConnectionList from './connectionList';
import RoomList from './roomList';
import AppFrame from './appFrame';
import * as RoomActions from '../action/room';

class App extends Component {
  dispatchTest() {
    // Hmm.
    this.props.dispatch(RoomActions.create({
      name: 'Gorani is best'
    }));
  }
  render() {
    // Just a mockup..
    return (
      <ConnectionKeeper>
        <AppFrame sideBar={(
          <ConnectionList />
        )}>
          <RoomList />
          <button onClick={this.dispatchTest.bind(this)}>방 만들기</button>
        </AppFrame>
      </ConnectionKeeper>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(() => ({}))(App);
