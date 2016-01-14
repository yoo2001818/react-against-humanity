import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Entry from './entry';
import ConnectionList from '../../view/connectionList';

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
          <Entry hideHeader noPadding>
            <ul className='side-navigation'>
              <li><a>{__('GameLobbyTitle')}</a></li>
              <li><a>{__('ProfileTitle')}</a></li>
            </ul>
          </Entry>
          <Entry name={__('ConnectedUserListTitle')}>
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
