import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class ChatHeader extends Component {
  render() {
    const { open, onToggle, children } = this.props;
    return (
      <div className='chat-header'>
        <ul className='tab-list'>
          { children }
          <li className='right-icon'>
            <a className={classNames('button minimize', { open })}
              onClick={onToggle}
            />
          </li>
        </ul>
      </div>
    );
  }
}

ChatHeader.propTypes = {
  open: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.node
};
