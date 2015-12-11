import React, { Component, PropTypes } from 'react';
import FullOverlay from '../fullOverlay';
import Dialog, { Controls } from '../dialog';
import Button from '../button';

export default class Failed extends Component {
  render() {
    const { onReconnect } = this.props;
    return (
      <FullOverlay>
        <Dialog title='Connection failed'>
          Unable to connect to the server.
          <Controls>
            <Button onClick={onReconnect}>Reconnect</Button>
          </Controls>
        </Dialog>
      </FullOverlay>
    );
  }
}

Failed.propTypes = {
  error: PropTypes.number,
  onReconnect: PropTypes.func
};
