import React, { Component } from 'react';

export default class RoomActionBar extends Component {
  render() {
    return (
      <div className='room-action-bar'>
        <a className='action join'>
          <span className='icon' />
          들어가기
        </a>
        <a className='action spectate'>
          <span className='icon' />
          관전하기
        </a>
      </div>
    );
  }
}
