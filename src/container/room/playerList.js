import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PlayerItem from '../../component/room/playerItem';

class PlayerList extends Component {
  render() {
    const { users, host, self } = this.props;
    return (
      <ul className='player-list'>
        {users.map(user => (
          <li key={user.id}>
            <PlayerItem user={user} isHost={host === user.id}
              canModerate={host === self && self !== user.id}
              canLeave={self === user.id}
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
  users: PropTypes.array
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
