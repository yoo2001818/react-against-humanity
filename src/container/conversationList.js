import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { chat } from '../action/chat';

import Conversation from '../component/conversation';
import ChatContainer from '../component/chatContainer';

import __ from '../lang';

class ConversationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: 0
    };
  }
  handleFocus(id) {
    this.setState({
      focused: id
    });
  }
  render() {
    const { focused } = this.state;
    const { conversations, chat } = this.props;
    let size = conversations.length;
    return (
      <div className='conversation-list'>
        {conversations.map((conversation, id) => (
          <Conversation
            title={conversation.title}
            key={id}
            onFocus={this.handleFocus.bind(this, id)}
            zIndex={(id == focused ? size :
              (id > focused ? (size - id) : (id + 1))
            ) + 100}
          >
            <ChatContainer
              messages={conversation.messages}
              onChat={chat.bind(null, conversation.scope)}
            />
          </Conversation>
        ))}
      </div>
    );
  }
}

ConversationList.propTypes = {
  conversations: PropTypes.array,
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
    conversations
  };
}, { chat })(ConversationList);
