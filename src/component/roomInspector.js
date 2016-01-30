import React, { Component, PropTypes } from 'react';

import __ from '../lang';

import ConnectionTag from './connectionTag';

export class Pane extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <div className='pane'>
        <div className='header'>{title}</div>
        <div className='content'>
          {children}
        </div>
      </div>
    );
  }
}

Pane.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node
};

export default class RoomInspector extends Component {
  render() {
    const { room, showCount } = this.props;
    return (
      <div className='room-inspector'>
        <Pane title={(
          <div className='float'>
            <div className='name'>{__('RoomPlayersName')}</div>
            {showCount && (
              <div className='count'>
                <span className='current'>
                  {room.userCount}
                </span>
                <span className='max'>
                  {room.maxUserCount}
                </span>
              </div>
            )}
          </div>
        )}>
          <ul>
            {room.users.map(connection => (
              <li key={connection.id}>
                <ConnectionTag connection={connection} />
              </li>
            ))}
          </ul>
        </Pane>
        <Pane title={__('RoomRulesName')}>
          WIP
        </Pane>
        <Pane title={__('RoomDecksName')}>
          WIP
        </Pane>
      </div>
    );
  }
}

RoomInspector.propTypes = {
  room: PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string
  }),
  showCount: PropTypes.bool
};
