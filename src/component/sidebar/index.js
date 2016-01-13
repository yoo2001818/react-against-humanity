import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Entry from './entry';
import ConnectionList from '../../view/connectionList';

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
          <Entry hideHeader>
            <div>갸아악</div>
          </Entry>
          <Entry name='접속자'>
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
