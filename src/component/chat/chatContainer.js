import React, { Component, PropTypes } from 'react';

import ChatForm from './chatForm';
import MessageList from './messageList';

export default class ChatContainer extends Component {
  render() {
    const { messages, onChat, canChat } = this.props;
    return (
      <div className='chat-container'>
        <MessageList messages={messages} ref='list' />
        <ChatForm onChat={onChat} canChat={canChat} ref='form' />
      </div>
    );
  }
}

ChatContainer.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    connection: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string
    }),
    type: PropTypes.string,
    message: PropTypes.string
  })),
  onChat: PropTypes.func,
  canChat: PropTypes.bool
};
