import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import RoomActionForm from '../container/form/roomActionForm';
import RoomInspector from './roomInspector';
import ConnectionTag from './connectionTag';

export default class RoomItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false
    };
  }
  componentWillReceiveProps(props) {
    if (!props.selected && this.state.showDetails) {
      this.setState({
        showDetails: false
      });
    }
  }
  toggleDetails() {
    this.setState({
      showDetails: !this.state.showDetails
    });
  }
  render() {
    const { room, selected, joined,
      onSelect = () => {}, onLeave, onJoin, onSpectate, canJoin } = this.props;
    const { showDetails } = this.state;
    return (
      <li
        className={classNames('room-item', { selected, joined, showDetails })}
        onClick={onSelect}
      >
        <div className='header'>
          <div className='name'>
            {room.name}
            <div className={classNames('lock', {
              password: room.lockType === 'password',
              invite: room.lockType === 'invite'
            })} />
          </div>
          <div className='status'>
            <div className='host'>
              <ConnectionTag connection={room.host} />
            </div>
            <div className='users'>
              <span className='current'>
                {room.userCount}
              </span>
              <span className='max'>
                {room.maxUserCount}
              </span>
            </div>
          </div>
        </div>
        { selected && (
          <div className='info'>
            <RoomInspector room={room} />
            <RoomActionForm
              room={room}
              joined={joined}
              canJoin={canJoin}
              canSpectate
              onJoin={onJoin}
              onLeave={onLeave}
              onSpectate={onSpectate}
            />
          </div>
        )}
      </li>
    );
  }
}

RoomItem.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    lockType: PropTypes.string
  }),
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  joined: PropTypes.bool,
  canJoin: PropTypes.bool,
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
  onSpectate: PropTypes.func
};
