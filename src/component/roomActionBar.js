import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import __ from '../lang';

export default class RoomActionBar extends Component {
  render() {
    const { showDetails, noDetails, onDetails = () => {},
      joined,
      onJoin = () => {},
      onLeave = () => {},
      onSpectate = () => {}
    } = this.props;
    return (
      <div className='room-action-bar'>
        <a className='action join' onClick={onJoin}>
          <span className='icon' />
          {__('JoinBtn')}
        </a>
        { joined && (
          <a className='action leave' onClick={onLeave}>
            <span className='icon' />
            {__('LeaveBtn')}
          </a>
        )}
        { joined || (
          <a className='action spectate' onClick={onSpectate}>
            <span className='icon' />
            {__('SpectateBtn')}
          </a>
        )}
        { noDetails || (
          <a
            className={classNames('action details', {open: showDetails})}
            onClick={onDetails}
          >
            {__('DetailsBtn')}
            <span className='icon' />
          </a>
        )}
      </div>
    );
  }
}

RoomActionBar.propTypes = {
  showDetails: PropTypes.bool,
  noDetails: PropTypes.bool,
  onDetails: PropTypes.func,
  joined: PropTypes.bool,
  joinedOther: PropTypes.bool,
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
  onSpectate: PropTypes.func
};
