import React, { Component } from 'react';

export default class RoomItem extends Component {
  render() {
    return (
      <tr className='room-item'>
        <td className='id'>
          0
        </td>
        <td className='lock' />
        <td className='state waiting' />
        <td className='name'>
          뭔지 정체를 알 수 없는 방
        </td>
        <td className='host'>
          끼로
        </td>
        <td className='users'>
          <span className='current'>
            1
          </span>
          <span className='max'>
            6
          </span>
        </td>
      </tr>
    );
  }
}
