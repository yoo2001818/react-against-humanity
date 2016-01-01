import React, { Component } from 'react';

import ConnectionKeeper from './connectionKeeper';
import ConnectionList from './connectionList';
import ChatContainer from './chatContainer';
import SidePane from '../component/sidePane';

export default class App extends Component {
  render() {
    return (
      <ConnectionKeeper>
        <SidePane>
          <div className='top connection'>
            <ConnectionList />
          </div>
          <div className='bottom chat'>
            <ChatContainer />
          </div>
        </SidePane>
      </ConnectionKeeper>
    );
  }
}
