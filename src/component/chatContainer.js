import React, { Component, PropTypes } from 'react';

import ChatForm from '../component/chatForm';
import MessageList from '../component/messageList';

export default class ChatContainer extends Component {
  render() {
    const { messages, onChat } = this.props;
    return (
      <div className='chat-container'>
        <MessageList messages={messages} />
        <ChatForm onChat={onChat} />
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
  onChat: PropTypes.func
};
