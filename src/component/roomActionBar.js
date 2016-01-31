import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import __ from '../lang';

export default class RoomActionBar extends Component {
  render() {
    const { showDetails, onDetails = () => {},
      joined, canJoin,
      onJoin = () => {},
      onLeave = () => {},
      onSpectate = () => {}
    } = this.props;
    return (
      <div className='room-action-bar'>
        <div className={classNames('action-container join', {
          disabled: !canJoin
        })}>
          <a className='action' onClick={onJoin}>
            <span className='icon' />
            {__('JoinBtn')}
          </a>
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
            <a className='action' onClick={onSpectate}>
              <span className='icon' />
              {__('SpectateBtn')}
            </a>
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
  showDetails: PropTypes.bool,
  onDetails: PropTypes.func,
  joined: PropTypes.bool,
  canJoin: PropTypes.bool,
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
  onSpectate: PropTypes.func
};
