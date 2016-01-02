import React, { Component } from 'react';

import ConnectionKeeper from './connectionKeeper';
import ConnectionList from './connectionList';
import ChatContainer from './chatContainer';

export default class App extends Component {
  render() {
    // Just a mockup..
    return (
      <ConnectionKeeper>
        <div id='app'>
          <div id='header'>
            <div className='content'>
              <div className='left'>
                Title
              </div>
              <div className='center'>
                Center
              </div>
              <div className='right'>
                Sign Out
              </div>
            </div>
          </div>
          <div id='container'>
            <div id='sidebar'>
              <ConnectionList />
            </div>
            <div id='content'>
              Content.
            </div>
          </div>
          <div id='conversation-list'>
            <div className='conversation open'>
              <div className='title'>
                Lobby
              </div>
              <div className='content'>
                <ChatContainer />
              </div>
            </div>
            <div className='conversation close'>
              <div className='title'>
                Chat Window
              </div>
              <div className='content'>
                Chat content
              </div>
            </div>
          </div>
        </div>
      </ConnectionKeeper>
    );
  }
}
