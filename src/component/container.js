import React, { Component, PropTypes } from 'react';

import Header from './header';
import ConversationList from '../container/conversationList';
import Sidebar from './sidebar';

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSidebar: false
    };
  }
  hideSidebar() {
    if (this.state.showSidebar) {
      this.setState({
        showSidebar: false
      });
    }
  }
  handleSidebar() {
    this.setState({
      showSidebar: !this.state.showSidebar
    });
  }
  render() {
    const { showSidebar } = this.state;
    const { children } = this.props;
    return (
      <div className='app-container'>
        <Header
          onSidebar={this.handleSidebar.bind(this)}
          showSidebar={showSidebar}
        />
        <div className='wrapper'>
          <Sidebar
            visible={showSidebar}
            onClose={this.hideSidebar.bind(this)}
          />
          <div className='content'>
            { children }
          </div>
        </div>
        { /* Is it okay to put this in here? */ }
        <ConversationList />
      </div>
    );
  }
}

Container.propTypes = {
  children: PropTypes.node
};
