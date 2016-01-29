import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import __ from '../lang';

import { logout } from '../action/connection';

import ConnectionTag from '../component/connectionTag';

class LoginMenu extends Component {
  render() {
    const { connection, logout } = this.props;
    if (connection.level === 'anonymous') {
      // Show login link
      return (
        <div className='login-menu anonymous'>
          <div className='action'>
            <Link to='/login'>{__('Login')}</Link>
          </div>
        </div>
      );
    }
    return (
      <div className='login-menu guest'>
        <div className='user-info'>
          <ConnectionTag connection={connection} />
        </div>
        <div className='action'>
          <Link to='/login' onClick={logout}>{__('Logout')}</Link>
        </div>
      </div>
    );
  }
}

LoginMenu.propTypes = {
  connection: PropTypes.object,
  logout: PropTypes.func
};

export default connect(state => ({
  connection: state.connection.list[state.connection.self]
}), { logout })(LoginMenu);
