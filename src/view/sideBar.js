import React, { Component } from 'react';

import ConnectionList from './connectionList';

export default class SideBar extends Component {
  render() {
    return (
      <div id='sidebar'>
        <ul className='menu'>
          <li>갸아악</li>
        </ul>
        <ConnectionList />
      </div>
    );
  }
}
