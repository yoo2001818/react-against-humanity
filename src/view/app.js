import React, { Component, PropTypes } from 'react';

import ErrorOverlay from './errorOverlay';
import ConnectionKeeper from './connectionKeeper';
import Container from '../component/container';

export default class App extends Component {
  render() {
    // Just a mockup..
    return (
      <div id='app'>
        <ConnectionKeeper>
          <Container>
            {this.props.children}
          </Container>
        </ConnectionKeeper>
        <ErrorOverlay />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};
