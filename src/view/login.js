import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as connectionActions from '../action/connection';

class Login extends Component {
  handleLogin(e) {
    this.props.dispatch(connectionActions.login({
      level: 'guest',
      name: this.refs.name.value
    }));
    e.preventDefault();
  }
  handleLogout() {
    this.props.dispatch(connectionActions.logout());
  }
  render() {
    const { level } = this.props;
    if (level !== 'anonymous') {
      return (
        <div>
          <p>You're already logged in!</p>
          <button onClick={this.handleLogout.bind(this)}>Logout</button>
        </div>
      );
    }
    return (
      <div>
        <p>This is a login form!</p>
        <form onSubmit={this.handleLogin.bind(this)}>
        <p><input ref='name' type='text' placeholder='name'/></p>
        <button>Login</button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  level: PropTypes.string
};

export default connect(state => {
  const connection = state.connection.list[state.connection.self];
  return {
    level: connection && connection.level
  };
})(Login);
