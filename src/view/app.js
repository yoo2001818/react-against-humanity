import React, { Component, PropTypes } from 'react';

import ErrorOverlay from '../container/errorOverlay';
import ConnectionKeeper from '../container/connectionKeeper';

export default class App extends Component {
  render() {
    // Just a mockup..
    return (
      <div id='app'>
        <ConnectionKeeper>
          {this.props.children}
        </ConnectionKeeper>
        <ErrorOverlay />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};
