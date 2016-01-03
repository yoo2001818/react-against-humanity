import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleOpen() {
    if (this.state.open) return;
    this.setState({
      open: true
    });
  }
  handleToggle() {
    this.setState({
      open: !this.state.open
    });
  }
  render() {
    const { open } = this.state;
    const { title, children, onFocus = () => {}, zIndex = 0 } = this.props;
    return (
      <div className={classNames('conversation-wrapper', { open })}>
        <div
          className={classNames('conversation', { open })}
          onClick={onFocus}
          style={{
            zIndex
          }}
        >
          <div className='title' onClick={this.handleOpen.bind(this)} >
            <i className='minimize' onClick={this.handleToggle.bind(this)} />
            <span className='name'>{title}</span>
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
  children: PropTypes.node,
  onFocus: PropTypes.func,
  zIndex: PropTypes.number
};
