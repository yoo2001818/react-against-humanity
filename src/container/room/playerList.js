import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import PlayerItem from '../../component/room/playerItem';

import { routeActions as RouteActions } from 'redux-simple-router';
import * as RoomActions from '../../action/room';

class PlayerList extends Component {
  handleLeave() {
    this.props.dispatch(RoomActions.leave())
    .then(() => this.props.dispatch(RouteActions.push('/')));
  }
  handleKick(id) {
    const { room, dispatch } = this.props;
    dispatch(RoomActions.kick(id, room.id));
  }
  handleTransferHost(id) {
    const { room, dispatch } = this.props;
    dispatch(RoomActions.transferHost(id, room.id));
  }
  render() {
    const { users, host, self, gameplay, room } = this.props;
    return (
      <ul className={classNames('player-list', { gameplay })}>
        {users.map(user => (
          <li key={user.id}>
            <PlayerItem user={user} isHost={gameplay ?
              room.gameplay.czar === user.id : host === user.id}
              canModerate={host === self && self !== user.id}
              canLeave={self === user.id}
              onLeave={this.handleLeave.bind(this)}
              onKick={this.handleKick.bind(this, user.id)}
              onTransferHost={this.handleTransferHost.bind(this, user.id)}
              showScore={gameplay}
              score={gameplay && room.gameplay.users[user.id] &&
                room.gameplay.users[user.id].points}
            />
          </li>
        ))}
      </ul>
    );
  }
}

PlayerList.propTypes = {
  host: PropTypes.number,
  self: PropTypes.number,
  users: PropTypes.array,
  room: PropTypes.object,
  gameplay: PropTypes.bool,
  dispatch: PropTypes.func
};

export default connect((state, props) => {
  const { connection: { list, self } } = state;
  const { room } = props;
  return {
    host: room.host,
    self,
    users: room.users.map(id => list[id])
  };
})(PlayerList);
