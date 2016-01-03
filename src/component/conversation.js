import '../style/conversation.scss';

import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }
  handleToggle() {
    this.setState({
      open: !this.state.open
    });
  }
  render() {
    const { open } = this.state;
    const { title, children } = this.props;
    return (
      <div className={classNames('conversation-wrapper', { open })}>
        <div className={classNames('conversation', { open })}>
          <div className='title' onClick={this.handleToggle.bind(this)}>
            {title}
          </div>
          <div className='content'>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Conversation.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};
