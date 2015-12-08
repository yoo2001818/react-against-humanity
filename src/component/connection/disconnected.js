import React, { Component, PropTypes } from 'react';
import FullOverlay from '../fullOverlay';
import Dialog, { Controls } from '../dialog';
import Button from '../button';

export default class Disconnected extends Component {
  render() {
    const { onReconnect } = this.props;
    return (
      <FullOverlay>
        <Dialog title='Connection closed'>
          Connection to the server closed.
          <Controls>
            <Button onClick={onReconnect}>Reconnect</Button>
          </Controls>
        </Dialog>
      </FullOverlay>
    );
  }
}

Disconnected.propTypes = {
  error: PropTypes.number,
  onReconnect: PropTypes.func
};
