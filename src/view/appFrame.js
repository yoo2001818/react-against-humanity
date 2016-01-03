import '../style/appFrame.scss';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Header from '../component/header';
import ConversationList from './conversationList';

export default class AppFrame extends Component {
  render() {
    const {
      showSideBar = true,
      children, sideBar
    } = this.props;
    return (
      <div id='app'>
        <Header />
        <div id='container' className={classNames({
          'sidebar-hidden': !showSideBar
        })}>
          <div id='sidebar'>
            { sideBar }
          </div>
          <div id='content'>
            { children }
          </div>
        </div>
        { /* Is it okay to put this in here? */ }
        <ConversationList />
      </div>
    );
  }
}

AppFrame.propTypes = {
  showSideBar: PropTypes.bool,
  children: PropTypes.node,
  sideBar: PropTypes.node
};
