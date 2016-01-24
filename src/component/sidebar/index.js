import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Entry from './entry';
import SideNavigation from '../../container/sideNavigation';
import ConnectionList from '../../container/connectionList';

import __ from '../../lang';

export default class Sidebar extends Component {
  render() {
    const { visible, onClose = () => {} } = this.props;
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
          <SideNavigation />
          <Entry title={__('ConnectedUserListTitle')}>
            <ConnectionList />
          </Entry>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func
};
