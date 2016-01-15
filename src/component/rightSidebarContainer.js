import React, { Component, PropTypes } from 'react';

export default class RightSidebarContainer extends Component {
  render() {
    const { children, sidebar } = this.props;
    return (
      <div className='right-sidebar-container'>
        <div className='content'>
          {children}
        </div>
        <div className='right-sidebar-wrapper'>
          <div className='right-sidebar'>
            {sidebar}
          </div>
        </div>
      </div>
    );
  }
}

RightSidebarContainer.propTypes = {
  children: PropTypes.node,
  sidebar: PropTypes.node
};
