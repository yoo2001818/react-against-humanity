import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Link } from 'react-router';

import __ from '../lang';

export default class RoomActionBar extends Component {
  render() {
    const { showDetails, onDetails = () => {},
      joined, canJoin, roomId,
      onJoin = () => {},
      onLeave = () => {},
      onSpectate = () => {}
    } = this.props;
    return (
      <div className='room-action-bar'>
        <div className={classNames('action-container join', {
          disabled: !canJoin
        })}>
          <Link to={`/room/${roomId}`} className='action' onClick={onJoin}>
            <span className='icon' />
            {__('JoinBtn')}
          </Link>
        </div>
        { joined && (
          <div className='action-container leave'>
            <a className='action' onClick={onLeave}>
              <span className='icon' />
              {__('LeaveBtn')}
            </a>
          </div>
        )}
        { joined || (
          <div className='action-container spectate'>
            <Link to={`/room/${roomId}`} className='action'
              onClick={onSpectate}
            >
              <span className='icon' />
              {__('SpectateBtn')}
            </Link>
          </div>
        )}
        <div
          className={classNames('action-container details', {
            open: showDetails
          })}
        >
          <a className='action' onClick={onDetails}>
            {__('DetailsBtn')}
            <span className='icon' />
          </a>
        </div>
      </div>
    );
  }
}

RoomActionBar.propTypes = {
  roomId: PropTypes.number,
  showDetails: PropTypes.bool,
  onDetails: PropTypes.func,
  joined: PropTypes.bool,
  canJoin: PropTypes.bool,
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
  onSpectate: PropTypes.func
};
