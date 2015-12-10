import React, { Component, PropTypes } from 'react';
import MessageItem from './messageItem';

export default class MessageList extends Component {
  render() {
    const { messages } = this.props;
    return (
      <div className='message-list'>
        { messages.map((message, id) => (
          <MessageItem key={id} {...message} />
        )) }
      </div>
    );
  }
}

MessageList.propTypes = {
  messages: PropTypes.array
};
