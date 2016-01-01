import React, { Component, PropTypes } from 'react';
import FullOverlay from '../fullOverlay';
import Dialog, { Controls } from '../dialog';
import Button from '../button';
import TextInput from '../textInput';
import __ from '../../lang';

export default class Handshake extends Component {
  handleSubmit(event) {
    event.preventDefault();
    const nickname = this.refs.form.nickname.value;
    if (nickname == '') return;
    // Flush nickname to localStorage
    try {
      window.localStorage.nickname = nickname;
    } catch (e) {
      // Do nothing;
    }
    this.props.onHandshake(nickname);
  }
  handleDisconnect(event) {
    event.preventDefault();
    this.props.onDisconnect();
  }
  render() {
    return (
      <FullOverlay>
        <Dialog title={__('SignInTitle')}>
          <form onSubmit={this.handleSubmit.bind(this)} ref='form'>
            <div>
              <TextInput
                placeholder={__('Nickname')}
                name='nickname'
                defaultValue=
                  {window.localStorage && window.localStorage.nickname}
              />
            </div>
            <Controls>
              <Button>{__('OK')}</Button>
            </Controls>
          </form>
        </Dialog>
      </FullOverlay>
    );
  }
}

Handshake.propTypes = {
  onHandshake: PropTypes.func,
  onDisconnect: PropTypes.func
};
