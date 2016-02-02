import React, { Component, PropTypes } from 'react';

export default class PlayerItem extends Component {
  render() {
    const { user, isHost, canModerate, canLeave,
      onTransferHost = () => {}, onKick = () => {},
      onLeave = () => {} } = this.props;
    return (
      <div className='player-item-component'>
        <div className='name'>
          {user.name}
          {isHost && (
            <div className='icon host' />
          )}
        </div>
        <div className='action-bar'>
          {canModerate && (
            <span>
              <button className='action transfer-host'
                onClick={onTransferHost}
              />
              <button className='action ban' onClick={onKick} />
            </span>
          )}
          {canLeave && (
            <button className='action leave' onClick={onLeave} />
          )}
        </div>
      </div>
    );
  }
}

PlayerItem.propTypes = {
  user: PropTypes.object,
  isHost: PropTypes.bool,
  canModerate: PropTypes.bool,
  canLeave: PropTypes.bool,
  onKick: PropTypes.func,
  onTransferHost: PropTypes.func,
  onLeave: PropTypes.func
};
