import React, { Component, PropTypes } from 'react';
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
  render() {
    const { conversations, selected, open, chat, toggle, select } = this.props;
    const conversation = (conversations[selected] || conversations[0]);
    const reverseLen = conversations.length - 1;
    return (
      <div className={classNames('chat-window', {open})}
        onKeyDown={this.handleKeyDown.bind(this)}
      >
        <div className='content'>
          <ChatHeader open={open} onToggle={toggle}>
            { conversations.reverse().map((conversation, key) => (
              <div
                className={classNames('tab', {
                  selected: (reverseLen - key === selected)
                })}
                onClick={select.bind(null, reverseLen - key)}
                key={key}
              >
                {conversation.title}
              </div>
            ))}
          </ChatHeader>
          <ChatContainer
             messages={conversation.messages}
             onChat={chat.bind(null, conversation.scope)}
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
