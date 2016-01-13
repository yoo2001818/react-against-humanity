import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import ErrorOverlay from './errorOverlay';
import ConnectionKeeper from './connectionKeeper';
import Container from '../component/container';
import Lobby from './lobby';
import Room from './room';

class App extends Component {
  render() {
    const { room } = this.props;
    // Just a mockup..
    return (
      <div id='app'>
        <ConnectionKeeper>
          <Container>
            { (room != null) ? (
              <Room id={room} />
            ) : (
              <Lobby />
            )}
          </Container>
        </ConnectionKeeper>
        <ErrorOverlay />
      </div>
    );
  }
}

App.propTypes = {
  room: PropTypes.number
};

export default connect(state => {
  const { connection: { list, self } } = state;
  // For now this is just a room object, however, we may inject actual
  // room object in here, if that's okay.
  let room = list && list[self] && list[self].room;
  // if (room != null) room = state.room.list[room];
  return { room };
})(App);
