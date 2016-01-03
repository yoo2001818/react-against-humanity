import React, { Component } from 'react';

import ConnectionKeeper from './connectionKeeper';
import ConnectionList from './connectionList';
import AppFrame from './appFrame';

export default class App extends Component {
  render() {
    // Just a mockup..
    return (
      <ConnectionKeeper>
        <AppFrame sideBar={(
          <ConnectionList />
        )}>
          Content.
        </AppFrame>
      </ConnectionKeeper>
    );
  }
}
