import React, { Component } from 'react';
import Conversation from '../component/conversation';
import ChatContainer from './chatContainer';

import __ from '../lang';

export default class ConversationList extends Component {
  render() {
    return (
      <div className='conversation-list'>
        <Conversation title={__('GameLobbyChatTitle')}>
          <ChatContainer />
        </Conversation>
      </div>
    );
  }
}
