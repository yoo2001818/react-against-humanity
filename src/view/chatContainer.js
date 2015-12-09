import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { chat } from '../action/chat';

import ChatForm from '../component/chatForm';

class ChatContainer extends Component {
  render() {
    const { messages, chat } = this.props;
    return (
      <div className='chat-container'>
        <div className='message-list'>
          { messages.map((message, id) => (
            <div key={id} className='message'>
              {message.connection && message.connection.name}
              {': '}
              {message.message}
            </div>
          )) }
        </div>
        <ChatForm onChat={message => chat('global', {}, message)} />
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
  chat: PropTypes.func.isRequired
};

export default connect(
  state => {
    const { chat: { messages }, connection: { list: connections } } = state;
    return {
      messages: messages.map(message => Object.assign({}, message, {
        connection: connections[message.connection]
      }))
    };
  },
  { chat }
)(ChatContainer);
