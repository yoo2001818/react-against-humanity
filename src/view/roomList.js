import React, { Component } from 'react';

import RoomItem from '../component/roomItem';

export default class RoomList extends Component {
  render() {
    return (
      <div className='room-list-container'>
        <table className='room-list'>
          <thead>
            <tr className='room-item head'>
              <td className='id'>ID</td>
              <td className='lock' />
              <td className='state' />
              <td className='name'>이름</td>
              <td className='host'>방장</td>
              <td className='users'>인원</td>
            </tr>
          </thead>
          <tbody>
            <RoomItem />
            <RoomItem />
            <RoomItem />
            <RoomItem />
            <RoomItem />
            <RoomItem />
          </tbody>
        </table>
      </div>
    );
  }
}
