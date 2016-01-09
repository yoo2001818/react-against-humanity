import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Header from '../component/header';
import ConversationList from './conversationList';

export default class AppFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSideBar: false
    };
  }
  handleSideBar() {
    this.setState({
      showSideBar: !this.state.showSideBar
    });
  }
  render() {
    const { showSideBar } = this.state;
    const {
      children, sideBar
    } = this.props;
    return (
      <div id='app-frame'>
        <Header
          onSideBar={this.handleSideBar.bind(this)}
          showSideBar={showSideBar}
        />
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
  children: PropTypes.node,
  sideBar: PropTypes.node
};
