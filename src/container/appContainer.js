import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { open, close, toggle } from '../action/sidebar';

import Header from '../component/header';
import Sidebar from '../component/sidebar';

import Entry from '../component/sidebar/entry';
import SideNavigation from './sideNavigation';
import ConnectionList from './connectionList';

import ChatWindow from './chatWindow';

import __ from '../lang';

class AppContainer extends Component {
  render() {
    const { title, headerRight, showLogin, sidebar, children,
      isOpen, close, toggle } = this.props;
    return (
      <div className='app-container'>
        <Header
          onSidebar={toggle.bind(null, null)}
          showSidebar={isOpen}
          title={title}
          right={headerRight}
          showLogin={showLogin}
        />
        <div className='wrapper'>
          <Sidebar
            visible={isOpen}
            onClose={close.bind(null, null)}
          >
            <SideNavigation />
            <Entry title={__('ConnectedUserListTitle')}>
              <ConnectionList />
            </Entry>
            { sidebar }
          </Sidebar>
          <div className='content'>
            { children }
          </div>
        </div>
        <ChatWindow />
      </div>
    );
  }
}

AppContainer.propTypes = {
  title: PropTypes.node,
  headerRight: PropTypes.node,
  showLogin: PropTypes.bool,
  sidebar: PropTypes.node,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  open: PropTypes.func,
  close: PropTypes.func,
  toggle: PropTypes.func
};

export default connect(state => ({
  isOpen: state.sidebar.open
}), { open, close, toggle })(AppContainer);
