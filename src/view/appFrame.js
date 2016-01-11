import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Header from '../component/header';
import ConversationList from './conversationList';
import SideBar from './sideBar';

export default class AppFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSideBar: false
    };
  }
  hideSideBar() {
    if (this.state.showSideBar) {
      this.setState({
        showSideBar: false
      });
    }
  }
  handleSideBar() {
    this.setState({
      showSideBar: !this.state.showSideBar
    });
  }
  render() {
    const { showSideBar } = this.state;
    const { children } = this.props;
    return (
      <div id='app-frame'>
        <Header
          onSideBar={this.handleSideBar.bind(this)}
          showSideBar={showSideBar}
        />
        <div id='container' className={classNames({
          'sidebar-hidden': !showSideBar
        })}>
          <div
            className='sidebar-overlay'
            onMouseDown={this.hideSideBar.bind(this)}
            onTouchStart={this.hideSideBar.bind(this)}
          />
          <SideBar />
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
  children: PropTypes.node,
  sideBar: PropTypes.node
};
