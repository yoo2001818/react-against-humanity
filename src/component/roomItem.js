import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import __ from '../lang';

import ErrorInput from './ui/errorInput';
import RoomActionBar from './roomActionBar';
import RoomInspector from './roomInspector';
import ConnectionTag from './connectionTag';

export default class RoomItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      passwordValue: ''
    };
  }
  componentWillReceiveProps(props) {
    if (!props.selected && this.state.showDetails) {
      this.setState({
        showDetails: false
      });
    }
  }
  handleJoin(e) {
    if (this.props.room.lockType === 'password') {
      if (this.state.passwordValue.length === 0) {
        return e.preventDefault();
      }
      this.props.onJoin(e, {
        password: this.state.passwordValue
      });
    } else {
      this.props.onJoin(e);
    }
  }
  handlePassword(e) {
    this.setState({
      passwordValue: e.target.value
    });
  }
  toggleDetails() {
    this.setState({
      showDetails: !this.state.showDetails
    });
  }
  render() {
    const { room, selected, joined,
      onSelect = () => {}, onLeave, onSpectate, canJoin } = this.props;
    const { showDetails, passwordValue } = this.state;
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
            <form onSubmit={this.handleJoin.bind(this)}>
              { room.lockType === 'password' && (
                <div className='password-form'>
                  <ErrorInput
                    placeholder={__('RoomPasswordName')}
                    type='password'
                    value={passwordValue}
                    onChange={this.handlePassword.bind(this)}
                    onBlur={this.handlePassword.bind(this)}
                  />
                </div>
              )}
              <RoomActionBar
                roomId={room.id}
                showDetails={showDetails}
                onDetails={this.toggleDetails.bind(this)}
                joined={joined}
                onJoin={this.handleJoin.bind(this)}
                onLeave={onLeave}
                onSpectate={onSpectate}
                canJoin={canJoin && (room.lockType !== 'password' ||
                  passwordValue.length !== 0
                )}
              />
            </form>
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
