import React, { Component } from 'react';

import AppContainer from '../container/appContainer';

export default class NotFound extends Component {
  render() {
    return (
      <AppContainer title='404'>
        <div>
          Page not found
        </div>
      </AppContainer>
    );
  }
}
