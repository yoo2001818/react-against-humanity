import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import __ from '../lang';
import * as connectionActions from '../action/connection';
import GridEntry from '../component/ui/gridEntry';
import Button from '../component/ui/button';
import AppContainer from '../container/appContainer';

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
    return (
      <AppContainer title={__('LoginTitle')} showLogin>
        { level !== 'anonymous' ? (
          <div className='login-view'>
            <div className='pane login-logout'>
              <GridEntry title={__('AlreadyLoggedInTitle')}>
                <p className='message'>
                  {__('AlreadyLoggedInMsg')}
                </p>
                <div className='controls'>
                  <Button onClick={this.handleLogout.bind(this)}>
                    {__('Logout')}
                  </Button>
                </div>
              </GridEntry>
            </div>
          </div>
        ) : (
          <div className='login-view'>
            <div className='pane login-id'>
              <GridEntry title={__('IdLoginTitle')}>
                <p>WIP</p>
              </GridEntry>
            </div>
            <div className='pane login-social'>
              <GridEntry title={__('SocialLoginTitle')}>
                <p>WIP</p>
              </GridEntry>
            </div>
            <div className='pane login-guest'>
              <GridEntry title={__('GuestLoginTitle')}>
                <form onSubmit={this.handleLogin.bind(this)}>
                  <p>
                    {/* I have to use TextInput component for this, but
                      * using ref isn't possible with that. But I'll change
                      * this to redux-form or something, so until then,
                      * I'll leave it like this.
                      */}
                    <input ref='name' type='text' placeholder={__('Nickname')}
                      className='text-input-component'
                      />
                  </p>
                  <Button>{__('Login')}</Button>
                </form>
              </GridEntry>
            </div>
          </div>
        )}
      </AppContainer>
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
