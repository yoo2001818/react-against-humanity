import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { chat } from '../action/chat';
import { select, toggle } from '../action/chatTab';

import __ from '../lang';
import ChatHeader from '../component/chat/chatHeader';
import ChatContainer from '../component/chat/chatContainer';

class ChatWindow extends Component {
  handleKeyDown(e) {
    // TAB key
    if (e.keyCode === 9) {
      const { select, selected, conversations } = this.props;
      select((selected + 1) % conversations.length);
      e.preventDefault();
    }
  }
  handleSelect(id) {
    const { select } = this.props;
    select(id);
    // Wait some time for DOM update..
    setTimeout(() => {
      // WTF WHY?????? What the ****??
      findDOMNode(this.refs.chatContainer.refs.form.refs.input).focus();
    }, 0);
  }
  handleToggle() {
    const { toggle } = this.props;
    toggle();
    // Wait some time for DOM update..
    setTimeout(() => {
      // Sigh....
      findDOMNode(this.refs.chatContainer.refs.form.refs.input).focus();
    }, 0);
  }
  render() {
    const { conversations, selected, open, chat } = this.props;
    const conversation = (conversations[selected] || conversations[0]);
    const reverseLen = conversations.length - 1;
    return (
      <div className={classNames('chat-window', {open})}
        onKeyDown={this.handleKeyDown.bind(this)}
      >
        <div className='content'>
          <ChatHeader open={open} onToggle={this.handleToggle.bind(this)}>
            { conversations.reverse().map((conversation, key) => (
              <div
                className={classNames('tab', {
                  selected: (reverseLen - key === selected)
                })}
                onClick={this.handleSelect.bind(this, reverseLen - key)}
                key={key}
              >
                {conversation.title}
              </div>
            ))}
          </ChatHeader>
          <ChatContainer
             messages={conversation.messages}
             onChat={chat.bind(null, conversation.scope)}
             ref='chatContainer'
           />
        </div>
      </div>
    );
  }
}

ChatWindow.propTypes = {
  conversations: PropTypes.array,
  selected: PropTypes.number,
  open: PropTypes.bool,
  toggle: PropTypes.func,
  select: PropTypes.func,
  chat: PropTypes.func
};

export default connect(state => {
  let conversations = [{
    // TODO no translation key in here, please?
    title: __('GameLobbyChatTitle'),
    scope: 'global',
    messages: state.chat.messages
  }];
  const connection = state.connection.list[state.connection.self];
  // If current user is in the room...
  if (connection && connection.roomId != null) {
    const room = state.room.list[connection.roomId];
    conversations.push({
      title: room.name,
      scope: 'room',
      messages: room.chat.messages
    });
  }
  return {
    selected: state.chatTab.selected,
    open: state.chatTab.open,
    conversations
  };
}, { chat, select, toggle })(ChatWindow);
