import React, { Component } from 'react';

import ConnectionList from './connectionList';

export default class App extends Component {
  render() {
    return (
      <div>
        Hello!
        <ConnectionList />
      </div>
    );
  }
}
