import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';

import FullOverlay from '../component/fullOverlay';
import Dialog, { Controls } from '../component/dialog';

// Shows a loading message while connecting.
// Shows an error message when disconnected.
// Shows a nickname form when connected but not handshaked yet.
// Otherwise, shows props.children.

class ConnectionKeeper extends Component {
  render() {
    const {
      pending = (
        <FullOverlay>
          <Dialog title='Loading'>
            Connecting to the server...
          </Dialog>
        </FullOverlay>
      ),
      disconnected = (
        <FullOverlay>
          <Dialog title='Disconnected'>
            Disconnected from the server.
          </Dialog>
        </FullOverlay>
      ),
      connected = (
        <FullOverlay>
          <Dialog title='Login'>
            Connected to the server.
            <Controls />
          </Dialog>
        </FullOverlay>
      ),
      children, transport, connectionId
    } = this.props;
    if (transport.status === 'pending') {
      return pending;
    }
    if (transport.status === 'disconnected') {
      return cloneElement(disconnected, {error: transport.error});
    }
    if (transport.status === 'connected' && connectionId == null) {
      return connected;
    }
    return children;
  }
}

ConnectionKeeper.propTypes = {
  pending: PropTypes.node,
  disconnected: PropTypes.node,
  connected: PropTypes.node,
  children: PropTypes.node,
  transport: PropTypes.shape({
    status: PropTypes.string.isRequired,
    error: PropTypes.any
  }).isRequired,
  connectionId: PropTypes.number
};

export default connect(
  state => ({
    transport: state.transport,
    connectionId: state.connection.self
  })
)(ConnectionKeeper);
