import React, { Component, PropTypes } from 'react';

import ErrorOverlay from '../container/errorOverlay';
import ConnectionKeeper from '../container/connectionKeeper';

import ChatWindow from '../container/chatWindow';

export default class App extends Component {
  render() {
    // Just a mockup..
    return (
      <div id='app'>
        <ConnectionKeeper>
          <div className='app-wrapper'>
            {this.props.children}
            <ChatWindow />
          </div>
        </ConnectionKeeper>
        <ErrorOverlay />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};
