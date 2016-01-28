import React, { Component, PropTypes } from 'react';

import ErrorOverlay from '../container/errorOverlay';
import ConnectionKeeper from '../container/connectionKeeper';
import ConversationList from '../container/conversationList';

export default class App extends Component {
  render() {
    // Just a mockup..
    return (
      <div id='app'>
        <ConnectionKeeper>
          {this.props.children}
        </ConnectionKeeper>
        <ConversationList />
        <ErrorOverlay />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};
