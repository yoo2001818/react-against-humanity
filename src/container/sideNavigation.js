import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Link, IndexLink } from 'react-router';
import Entry from '../component/sidebar/entry';

import __ from '../lang';

class SideNavigation extends Component {
  render() {
    const { roomId } = this.props;
    return (
      <Entry hideHeader noPadding>
        <ul className='side-navigation'>
          <li>
            <IndexLink activeClassName='active' to='/'>
              {__('GameLobbyTitle')}
            </IndexLink>
          </li>
          { roomId != null && (
            <li>
              <Link activeClassName='active' to={`/room/${roomId}`}>
              {__('JoinedRoomTitle')}
              </Link>
            </li>
          )}
          <li><a>{__('ProfileTitle')}</a></li>
        </ul>
      </Entry>
    );
  }
}

SideNavigation.propTypes = {
  roomId: PropTypes.number
};

export default connect(state => {
  const connection = state.connection.list[state.connection.self];
  return {
    roomId: connection && connection.roomId,
    routing: state.routing
  };
}, undefined, undefined, { pure: false })(SideNavigation);
