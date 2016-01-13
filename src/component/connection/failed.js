import React, { Component, PropTypes } from 'react';
import FullOverlay from '../ui/fullOverlay';
import Dialog, { Controls } from '../ui/dialog';
import Button from '../ui/button';

import __ from '../../lang';

export default class Failed extends Component {
  render() {
    const { onReconnect } = this.props;
    return (
      <FullOverlay>
        <Dialog title={__('ConnFailedTitle')}>
          {__('ConnFailedDesc')}
          <Controls>
            <Button onClick={onReconnect}>{__('Reconnect')}</Button>
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
