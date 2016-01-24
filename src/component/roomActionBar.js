import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class RoomActionBar extends Component {
  render() {
    const { showDetails, noDetails, onDetails = () => {}, joined } = this.props;
    return (
      <div className='room-action-bar'>
        <a className='action join'>
          <span className='icon' />
          들어가기
        </a>
        { joined || (
          <a className='action spectate'>
            <span className='icon' />
            관전하기
          </a>
        )}
        { noDetails || (
          <a
            className={classNames('action details', {open: showDetails})}
            onClick={onDetails}
          >
            자세히
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
  joined: PropTypes.bool
};
