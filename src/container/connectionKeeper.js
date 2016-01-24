import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';

import { reconnect, disconnect } from '../action/transport';
import { handshake } from '../action/connection';

import FullOverlay from '../component/ui/fullOverlay';
import Dialog from '../component/ui/dialog';

import Failed from '../component/connection/failed';
import Disconnected from '../component/connection/disconnected';

import __ from '../lang';

// Shows a loading message while connecting.
// Shows an error message when disconnected.
// Shows a nickname form when connected but not handshaked yet.
// Otherwise, shows props.children.

class ConnectionKeeper extends Component {
  render() {
    const {
      pending = (
        <FullOverlay>
          <Dialog title={__('ConnectingTitle')}>
            {__('ConnectingDesc')}
          </Dialog>
        </FullOverlay>
      ),
      failed = (
        <Failed />
      ),
      disconnected = (
        <Disconnected />
      ),
      children, transport, reconnect, connectionId
    } = this.props;
    if (transport.status === 'pending' ||
      (transport.status === 'connected' && connectionId == null)) {
      return pending;
    }
    if (transport.status === 'disconnected') {
      return cloneElement(disconnected, {
        error: transport.error,
        onReconnect: reconnect
      });
    }
    if (transport.status === 'failed') {
      return cloneElement(failed, {
        error: transport.error,
        onReconnect: reconnect
      });
    }
    return children;
  }
}

ConnectionKeeper.propTypes = {
  pending: PropTypes.node,
  failed: PropTypes.node,
  disconnected: PropTypes.node,
  children: PropTypes.node,
  transport: PropTypes.shape({
    status: PropTypes.string.isRequired,
    error: PropTypes.any
  }).isRequired,
  connectionId: PropTypes.number,
  reconnect: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired
};

export default connect(
  state => ({
    transport: state.transport,
    connectionId: state.connection.self
  }),
  { reconnect, disconnect, handshake }
)(ConnectionKeeper);
