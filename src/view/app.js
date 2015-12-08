import React, { Component } from 'react';

import ConnectionKeeper from './connectionKeeper';
import ConnectionList from './connectionList';

export default class App extends Component {
  render() {
    return (
      <ConnectionKeeper>
        <div>
          <ConnectionList />
        </div>
      </ConnectionKeeper>
    );
  }
}
