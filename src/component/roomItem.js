import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import RoomActionBar from './roomActionBar';
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
      onSelect = () => {}, onJoin, onLeave, onSpectate } = this.props;
    const { showDetails } = this.state;
    return (
      <li
        className={classNames('room-item', { selected, joined, showDetails })}
        onClick={onSelect}
      >
        <div className='header'>
          <div className='name'>
            {room.name}
            <div className={classNames('lock', {enabled: room.locked})} />
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
        <div className='info'>
          <RoomInspector room={room} />
          { selected && (
            <RoomActionBar
              showDetails={showDetails}
              onDetails={this.toggleDetails.bind(this)}
              joined={joined}
              onJoin={onJoin}
              onLeave={onLeave}
              onSpectate={onSpectate}
            />
          )}
        </div>
      </li>
    );
  }
}

RoomItem.propTypes = {
  room: PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string
  }),
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  joined: PropTypes.bool,
  onJoin: PropTypes.func,
  onLeave: PropTypes.func,
  onSpectate: PropTypes.func
};
