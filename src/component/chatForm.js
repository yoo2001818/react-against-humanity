import '../style/chatForm.scss';

import React, { Component, PropTypes } from 'react';

import TextInput from './textInput';

export default class ChatForm extends Component {
  handleSubmit(event) {
    event.preventDefault();
    const { message } = this.refs.form;
    if (message.value == '') return;
    this.props.onChat(message.value);
    message.value = '';
  }
  render() {
    return (
      <div className='chat-form'>
        <form onSubmit={this.handleSubmit.bind(this)} ref='form'>
          <div className='message'>
            <TextInput
              placeholder='Type message...'
              name='message'
            />
          </div>
        </form>
      </div>
    );
  }
}

ChatForm.propTypes = {
  onChat: PropTypes.func.isRequired
};
