import React, { Component } from 'react';
import Conversation from '../component/conversation';
import ChatContainer from './chatContainer';

import __ from '../lang';

export default class ConversationList extends Component {
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
    let indexes = [0];
    let size = indexes.length;
    return (
      <div className='conversation-list'>
        {indexes.map((_, id) => (
          <Conversation
            title={__('GameLobbyChatTitle')}
            key={id}
            onFocus={this.handleFocus.bind(this, id)}
            zIndex={id == focused ? size :
              (id > focused ? (size - id) : (id + 1))
            }
          >
            <ChatContainer />
          </Conversation>
        ))}
      </div>
    );
  }
}
