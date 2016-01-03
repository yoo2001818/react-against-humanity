import '../style/header.scss';

import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    return (
      <div id='header'>
        <div className='content'>
          <div className='left'>
            Title
          </div>
          <div className='center'>
            Center
          </div>
          <div className='right'>
            Sign Out
          </div>
        </div>
      </div>
    );
  }
}
