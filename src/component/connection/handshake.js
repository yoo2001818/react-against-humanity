import React, { Component, PropTypes } from 'react';
import FullOverlay from '../fullOverlay';
import Dialog, { Controls } from '../dialog';
import Button from '../button';
import TextInput from '../textInput';

export default class Handshake extends Component {
  handleSubmit(event) {
    event.preventDefault();
    const nickname = this.refs.form.nickname.value;
    if (nickname == '') return;
    this.props.onHandshake(nickname);
  }
  handleDisconnect(event) {
    event.preventDefault();
    this.props.onDisconnect();
  }
  render() {
    return (
      <FullOverlay>
        <Dialog title='Log in'>
          <form onSubmit={this.handleSubmit.bind(this)} ref='form'>
            <div>
              <TextInput
                placeholder='Nickname'
                name='nickname'
              />
            </div>
            <Controls>
              <Button>OK</Button>
              <Button onClick={this.handleDisconnect.bind(this)}>
                Disconnect
              </Button>
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
