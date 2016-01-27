import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Sidebar extends Component {
  render() {
    const { children, visible, onClose = () => {} } = this.props;
    return (
      <div className={classNames('sidebar-container', {
        'hidden': !visible
      })}>
        <div
          className='sidebar-overlay'
          onMouseDown={onClose}
          onTouchStart={onClose}
        />
        <div className='sidebar-root'>
          {children}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  children: PropTypes.node,
  visible: PropTypes.bool,
  onClose: PropTypes.func
};
