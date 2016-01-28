import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import MessageItem from './messageItem';

export default class MessageList extends Component {
  componentDidMount() {
    let node = findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }
  componentWillUpdate() {
    let node = findDOMNode(this);
    this.shouldScrollBottom =
      node.scrollTop + node.offsetHeight === node.scrollHeight;
  }
  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      let node = findDOMNode(this);
      node.scrollTop = node.scrollHeight;
    }
  }
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
