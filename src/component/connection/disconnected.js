import React, { Component, PropTypes } from 'react';
import FullOverlay from '../fullOverlay';
import Dialog, { Controls } from '../dialog';
import Button from '../button';

import __ from '../../lang';

export default class Disconnected extends Component {
  render() {
    const { onReconnect } = this.props;
    return (
      <FullOverlay>
        <Dialog title={__('ConnClosedTitle')}>
          {__('ConnClosedDesc')}
          <Controls>
            <Button onClick={onReconnect}>{__('Reconnect')}</Button>
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
