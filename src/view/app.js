import React, { Component } from 'react';

import ConnectionKeeper from './connectionKeeper';
import ConnectionList from './connectionList';
import ChatContainer from './chatContainer';

export default class App extends Component {
  render() {
    return (
      <ConnectionKeeper>
        <div>
          <ConnectionList />
          <ChatContainer />
        </div>
      </ConnectionKeeper>
    );
  }
}
