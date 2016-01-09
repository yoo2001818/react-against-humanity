import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import FullOverlay from '../component/fullOverlay';
import Dialog from '../component/dialog';
import Button from '../component/button';

import { dismiss } from '../action/error';
import __ from '../lang';

class ErrorOverlay extends Component {
  render() {
    const { enabled, message, stack, type, dismiss } = this.props;
    if (!enabled) return false;
    return (
      <FullOverlay filter>
        <Dialog title={__('ErrorTitle')}>
          <p>{message + ' @ ' + type}</p>
          <code><pre>{stack}</pre></code>
          <Button onClick={dismiss}>{__('Dismiss')}</Button>
        </Dialog>
      </FullOverlay>
    );
  }
}

ErrorOverlay.propTypes = {
  enabled: PropTypes.bool.isRequired,
  dismiss: PropTypes.func.isRequired,
  message: PropTypes.string,
  stack: PropTypes.string,
  type: PropTypes.string
};

export default connect(state => state.error, { dismiss })(ErrorOverlay);
