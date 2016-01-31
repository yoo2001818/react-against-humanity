import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import TextInput from '../ui/textInput';

import __ from '../../lang';

export default class ChatForm extends Component {
  handleSubmit(event) {
    event.preventDefault();
    const { message } = this.refs.form;
    if (message.value == '') return;
    this.props.onChat(message.value);
    message.value = '';
  }
  render() {
    const { canChat } = this.props;
    return (
      <div className={classNames('chat-form', {
        disabled: !canChat
      })}>
        <form onSubmit={this.handleSubmit.bind(this)} ref='form'>
          <div className='message'>
            <TextInput
              placeholder=
                {canChat ? __('ChatPlaceholder') : __('ChatNeedLogin')}
              name='message'
              autoComplete='off'
              ref='input'
              disabled={!canChat}
            />
          </div>
        </form>
      </div>
    );
  }
}

ChatForm.propTypes = {
  onChat: PropTypes.func.isRequired,
  canChat: PropTypes.bool
};
