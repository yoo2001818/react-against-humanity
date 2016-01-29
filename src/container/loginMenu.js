import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import __ from '../lang';

import { logout } from '../action/connection';

import ConnectionTag from '../component/connectionTag';
import DropDown from '../component/ui/dropDown';

class LoginMenu extends Component {
  handleLogout(e) {
    const { logout } = this.props;
    logout();
    e.preventDefault();
  }
  render() {
    const { connection } = this.props;
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
          <DropDown href='#' title={(
            <ConnectionTag connection={connection} />
          )}>
            <ul className='menu-list'>
              <li>
                <Link to='/login' onClick={this.handleLogout.bind(this)}>
                  {__('Logout')}
                </Link>
              </li>
            </ul>
          </DropDown>
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
