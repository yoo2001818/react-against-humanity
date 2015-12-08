import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';

import { reconnect } from '../action/transport';
import { handshake } from '../action/connection';

import FullOverlay from '../component/fullOverlay';
import Dialog from '../component/dialog';

import Disconnected from '../component/connection/disconnected';
import Handshake from '../component/connection/handshake';

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
        <Disconnected />
      ),
      connected = (
        <Handshake />
      ),
      children, transport, connectionId, reconnect, handshake
    } = this.props;
    if (transport.status === 'pending') {
      return pending;
    }
    if (transport.status === 'disconnected') {
      return cloneElement(disconnected, {
        error: transport.error,
        onReconnect: reconnect
      });
    }
    if (transport.status === 'connected' && connectionId == null) {
      return cloneElement(connected, {
        onHandshake: name => handshake({
          name, version: '0.0.1'
        })
      });
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
  connectionId: PropTypes.number,
  reconnect: PropTypes.func.isRequired,
  handshake: PropTypes.func.isRequired
};

export default connect(
  state => ({
    transport: state.transport,
    connectionId: state.connection.self
  }),
  { reconnect, handshake }
)(ConnectionKeeper);
